---
title: 'Cloudflare Workers VPC 发布：让 Serverless 直通你的私有网络'
subtitle: 'Workers VPC 正在打破"无服务器函数"与"私有内网"之间的壁垒'
description: 'Cloudflare 推出 Workers VPC（Beta），允许 Workers 通过私有隧道安全连接内网服务——数据库、私有 API、NAS、本地大模型。本文带你理解架构原理、五大玩法和快速上手步骤。'
pubDate: 2026-05-08
lastModDate: 2026-05-08
minutesRead: 8
tags: ["Cloudflare", "Serverless", "VPC", "内网穿透", "DevOps"]
toc: true
---

> **Workers VPC = 给你的 Serverless 函数装了一根"内网专线"。**

以前 Workers 跑在全球边缘节点上，但想访问家里的 NAS、办公室的数据库、AWS 的私有资源？要么开公网端口（等着被扫），要么折腾 WireGuard 内网穿透（运维地狱）。Workers VPC 把这件事变成了：在 Cloudflare 控制台点几下 + 一行绑定配置 = 丝滑内网访问。

## 它解决了什么问题？

Serverless 函数天然跑在"公网"上。你想让它读一下内网 PostgreSQL 的数据，或者调一下办公室 GitLab 的私有 API，传统方案只有两条路：

- **暴露到公网**：给数据库配公网 IP + 白名单，等于把家门钥匙挂门口
- **自建隧道**：frp、ngrok、WireGuard，运维成本高，延迟不可控

Workers VPC 的答案很巧妙：**让 Cloudflare 的网络变成你的私有网络的一部分。**

架构分三层：

1. **Cloudflare Tunnel**：在你的内网（可以是家里、办公室、AWS VPC、任意云）跑一个轻量级隧道，连到 Cloudflare
2. **VPC Service**：在 Cloudflare 控制台为内网的每个服务创建一个"登记"，支持 HTTP 和 TCP
3. **VPC Service Binding**：在 Worker 代码里绑定这些服务，像调 `fetch()` 一样调用内网地址

整个过程，你的内网资源**自始至终不暴露在公网上**。

## 五大实战玩法

### 1. 私人大模型 RAG 助手

你本地 Ollama 跑了个 Llama 3，不需要把它挂到公网上暴露 API。在 Workers 上写一个 AI 代理逻辑，通过 VPC 直连你内网服务器的私有 API 端点。你的私有数据全程走私有隧道，数据不出内网，但推理请求经过 Cloudflare 全球边缘加速——**人在任何地方都能用你家里的 GPU 算力**。

### 2. "全球家庭内网"仪表盘

这是 Home Assistant 玩家和 NAS 用户的福音。不用搞 DDNS、不用配端口转发、不用折腾 ZeroTier。在 Workers 上写一个轻量前端，通过 VPC Service Binding 直接拉内网设备的状态数据。配合 Cloudflare Access 做身份认证，出门在外一秒打开家里的服务，延迟低到感觉就像在局域网里。

### 3. 极速私有数据库代理

数据库从来不敢开公网，但 Workers 想读怎么办？Workers VPC + Hyperdrive 的黄金组合：

- VPC 负责打通到内网数据库的私有通路
- Hyperdrive 自动接管连接池和查询缓存

等于你的私有数据库瞬间拥有了全球分布式缓存加速，还能省掉复杂的防火墙规则配置。

### 4. 企业级 MCP Server

这是目前开发者社区最火的方向。在 Workers 上部署一个 MCP（Model Context Protocol）Server，通过 VPC 绑定内网的 Jira、Confluence、私有 GitLab 或内部 Wiki。你的 AI 智能体（Claude、Cursor 等）就能安全地读取企业内部文档，写代码时自动参考内部业务逻辑。**数据不出企业网络，AI 一样能用。**

### 5. 跨云"胶水代码"

你的核心数据在 AWS S3 上，但想用 Cloudflare Workers 的全球分发和处理能力？通过 VPC 直接连接 AWS 内部未公开的 S3 Bucket 或私有 API，在不暴露任何 AWS 资源到公网的前提下，用 Workers 做数据清洗、格式转换、协议适配。多云架构的最佳中间层。

## 架构和兼容性

Workers VPC 支持两种服务类型：

| 类型 | 用途 | 搭配产品 |
|------|------|---------|
| **HTTP** | Web API、RESTful 服务 | Workers、D1、R2 |
| **TCP** | 数据库、Redis、自定义协议 | Hyperdrive |

目前处于 **Beta 阶段**，**对所有方案（包括 Free 计划）免费开放**。Beta 期间功能完全可用，API 可能在 GA 前有变化。

支持的私有网络类型：本地局域网、AWS VPC、Azure VNet、GCP VPC、任意 on-premise 环境。

## 快速上手：打通你的第一个内网服务

### 前置条件

- Cloudflare 账号
- Node.js 安装

### 步骤

**1. 创建 Worker 项目**

```bash
npm create cloudflare@latest -- workers-vpc-app
```

选择 `Hello World example` → `Worker only` → `TypeScript`，暂不部署。

**2. 搭建 Cloudflare Tunnel**

在你的内网机器（可以是本地电脑、云服务器、办公室网关）上安装并运行 cloudflared：

```bash
cloudflared tunnel create my-private-tunnel
cloudflared tunnel run my-private-tunnel
```

在 Cloudflare Dashboard 的 Workers VPC 页面，创建 Tunnel 并配置目标网络（比如你的内网 CIDR `192.168.1.0/24`）。

**3. 创建 VPC Service**

在 Workers VPC 控制台创建一个 VPC Service，指定：

- 名称（如 `my-db` 或 `my-api`）
- 类型（HTTP 或 TCP）
- 目标地址（你内网服务的实际 IP:Port）

**4. 配置 Worker 绑定**

在 `wrangler.jsonc` 中添加绑定：

```json
{
  "name": "workers-vpc-app",
  "main": "src/index.ts",
  "compatibility_date": "2025-04-01",
  "vpc_services": [
    { "binding": "PRIVATE_API", "service": "my-api" }
  ]
}
```

**5. 写代码**

```typescript
export default {
  async fetch(request, env, ctx) {
    const response = await env.PRIVATE_API.fetch(
      "http://internal-api.company.local/data",
    );
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  },
};
```

**6. 本地测试**

```bash
npx wrangler dev
```

Wrangler 会自动建立到 VPC Service 的本地代理连接。

**7. 部署**

```bash
npx wrangler deploy
```

## 我的评价

Serverless 发展这么多年，最大的痛点之一就是**"有状态资源"的访问**。Workers 计算弹性和全球分发做得再好，你连不上自己内网的数据库也是白搭。

Workers VPC 的思路对路——不搞复杂网络配置，用 Cloudflare 已有的 Tunnel 基础设施 + Workers Binding 机制，把"私有网络访问"抽象成一行配置。对于独立开发者和小团队来说，这意味着：

- 不用折腾 VPN 了
- 不用给内网服务配上公网 IP 了
- 不用为"一个 Worker 读一下 Redis"写一堆网络胶水代码了

当然，这是 Beta 版本。我关注的点是：

- **TCP 服务的稳定性**：目前通过 Hyperdrive 支持 TCP，Hyperdrive 本身在复杂查询场景下的表现有待检验
- **延迟**：Tunnel 链路会增加一跳，但在 Cloudflare 内部网络里，这个开销应该远低于公网穿透方案
- **GA 后的定价**：免费 Beta 很香，但长期定价模型会决定它能不能成为基础设施标配

如果你也在用 Workers 做点什么有意思的东西，Workers VPC 值得现在就开始摸。毕竟——**免费 Beta，不摸白不摸**。

---

*参考：[Cloudflare Workers VPC 官方文档](https://developers.cloudflare.com/workers-vpc/)*
*作者：兰秋十六 | [lanqiu.tech](https://lanqiu.tech)*
