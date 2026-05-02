---
title: "当 Konva 连线和 React 打架：一个拖拽连线回弹 bug 的排查血泪史"
subtitle: "从 useMemo 到 RAF 强制同步，一次与 Konva reconciliation 的缠斗"
description: "在 React-Konva 画布中实现拖拽时连线实时跟随，踩遍了 useMemo 闭包陷阱、React-Konva reconciliation 覆写、requestAnimationFrame 时序等各种坑，最终找到根治方案。"
pubDate: 2026-05-02
minutesRead: 8
draft: false
toc: true
---

如果你在做一个基于 Konva 的无限画布应用，节点之间有连线（比如 AI 工作流里的 Source → Target 关系），那你一定会遇到这个问题：

> 拖拽节点时，连线实时跟着走没问题。但一松手，连线立刻弹回原来的位置，然后又跳到正确位置。甚至全部消失。

这个 bug 我修了整整一个晚上，踩了 4 个不同的坑。记录一下排查路径和最终方案。

## 背景

画布上每个图片节点可以连接到一个"来源节点"（sourceNode）。当 sourceNode 或子节点被拖动时，连接线需要实时更新。

连接线用 Konva 的 `Line` 组件渲染，配置 `bezier` 贝塞尔曲线，从 source 的右侧边缘连接到 target 的左侧边缘。

## 第一版：useMemo 渲染连线

最自然的写法 —— 用 React 组件渲染 Line：

```tsx
const connectionLayer = useMemo(() => {
  return (
    <Layer>
      {connections.map(conn => (
        <Line
          key={conn.id}
          points={[startX, startY, ...]}
          bezier
        />
      ))}
    </Layer>
  )
}, [connections, entities])
```

**问题：** 拖拽过程中，`handleNodeDragMove` 直接用 `node.x()` / `node.y()` 操作 Konva 节点（为了性能不上 React state）。但连线层是这个 useMemo，它依赖 `entities` state —— 只是拖拽过程中 state 没更新。

所以加了一个 `updateConnectionsLive()` 函数，在拖拽的 mousemove 里直接 `stage.find('Line')` 找到连线，用 Konva API 更新 points。拖拽中连线确实实时跟上了。

**但是拖拽一结束就回弹。** 为什么？因为 `handleNodeDragEnd` 里 `setEntities` 更新了 state → React 重渲染 → React-Konva reconciliation 把 Line 的 points 设回了 state 里的旧位置。

## 第二版：去掉 useMemo，内联渲染

把 `connectionLayer` 从 useMemo 改成 IIFE（立即执行函数），每次渲染重新计算：

```tsx
const connectionLayer = (() => {
  // ...
})()
```

没用。问题不是 memo 缓存，是 reconciliation 本身 —— React-Konva 每次渲染都会把 Konva Line 节点的 points 更新成 state 里的值。

## 第三版：RAF 兜底

在 `handleNodeDragEnd` 末尾加 `requestAnimationFrame`，在 React 渲染完成后强制把连线位置改回来：

```tsx
requestAnimationFrame(() => {
  stage.find('Line').filter(...).forEach(line => {
    line.points(newPoints)
  })
})
```

**这回更离谱：连线直接全部消失。**

排查后发现原因：`handleNodeDragEnd` 是用 `useCallback(fn, [])` 定义的，空依赖数组导致闭包里捕获的 `derivedConnections` 是**首次渲染时的空数组**。RAF 回调里：

```tsx
connLayer.destroyChildren()  // 删了所有线
for (const conn of derivedConnections) {  // 首次渲染的空数组！
  // 什么都没创建
}
```

所以线就全没了。

**教训 #1：** `useCallback([], [])` 闭包里的变量永远是第一次渲染时的值。不要在 RAF/setTimeout 里依赖闭包变量。

## 第四版：RAF + entitiesRef

改成用 `entitiesRef.current`（每帧同步的 ref）来读位置，不依赖闭包里的 `derivedConnections`：

```tsx
requestAnimationFrame(() => {
  const ents = entitiesRef.current
  for (const e of ents) {
    // 从 entity 的 sourceNode 算连线
  }
})
```

线没有消失了，但是 **回到老位置**。

为什么？`entitiesRef.current` 虽然是最新的 React state 同步，但是 **React state 的位置和 Konva 节点的实际位置可能不一致**。

拖拽过程中，`handleNodeDragMove` 直接调用了 `node.x(snappedX)` —— Konva 节点已经在那里了。但 `entitiesRef.current` 里的 x 还是旧值。`setEntities` 在 `handleNodeDragEnd` 里才更新 state，state 更新后才触发 render，render 后才同步到 `entitiesRef.current`。

RAF 虽然是在 render 之后触发，但 **React 的 batch 机制和 Konva 的事件循环时序可能让 ref 滞后**。

**教训 #2：** 永远不要用 React state/ref 来读取 Konva 节点的实时位置。它们有延迟。

## 最终方案：RAF + stage.find() + getClientRect()

最暴力也最可靠的方案 —— 从 Konva 节点树直接读坐标：

```tsx
requestAnimationFrame(() => {
  const cl = connectionLayerRef.current
  const stage = stageRef.current
  const contentLayer = contentLayerRef.current
  
  cl.destroyChildren()  // 清空旧线
  
  // 从 Konva 节点树找所有图片节点组
  stage.find('.image-node-group').forEach((group: any) => {
    const id = group.id()
    const srcId = /* 从 entity 的 sourceNode 拿 */
    
    const srcGroup = stage.findOne(`#${srcId}`)
    const srcRect = srcGroup.findOne('.node-body').getClientRect({ relativeTo: contentLayer })
    const tgtRect = group.findOne('.node-body').getClientRect({ relativeTo: contentLayer })
    
    // 根据实时坐标创建新 Line
    cl.add(new Konva.Line({
      points: [srcRect.x + srcRect.width, ..., tgtRect.x, ...],
      bezier: true,
    }))
  })
  
  cl.batchDraw()
})
```

关键点：
- `stage.find('.image-node-group')` 直接从 Konva 节点树查找
- `.getClientRect({ relativeTo: contentLayer })` 读取世界坐标
- `destroyChildren()` + 重新创建，不更新旧节点，避免 reconciliation 干扰
- RAF 在渲染后、绘制前执行，保证用户看不到中间态

**终于对了。**

## 总结

| 方案 | 问题 |
|------|------|
| useMemo + JSX 渲染 | React-Konva reconciliation 覆写 points |
| IIFE 内联渲染 | 同上 |
| RAF + 闭包变量 | `useCallback([])` 闭包陷阱，变量是首次渲染的值 |
| RAF + entitiesRef | ref 和 Konva 实际位置不同步 |
| ✅ RAF + stage.find() + getClientRect() | 从 Konva 节点树直接读坐标，永远准确 |

**核心原则：跟 Konva 交互时，能读节点实时坐标就别走 React state。`requestAnimationFrame` + `stage.find()` + `getClientRect()` 是最可靠的"渲染后强制同步"手段。**
