---
title: 'Hermes Agent 微信配置指南：用 AI 助手掌控你的微信'
description: '详细教程教你如何将 Hermes Agent 连接到个人微信，实现通过微信消息操控电脑、执行代码、管理文件等功能。从安装依赖到扫码登录，一步步带你完成配置。'
pubDate: 2026-04-11
tags: ["AI", "AI Agent", "Hermes", "微信", "教程"]
toc: true
---

> 想过用微信消息让 AI 帮你写代码、管文件、操作浏览器吗？Hermes Agent 的微信适配器让这一切成为可能。

## 什么是 Hermes Agent？

Hermes Agent 是 Nous Research 开发的个人 AI 助手，它可以通过你日常使用的聊天应用（微信、Telegram、Discord 等）操控你的电脑。与传统的聊天机器人不同，Hermes 可以：

- 直接执行终端命令
- 读写和搜索文件
- 操作浏览器
- 运行 Python 脚本
- 管理定时任务
- 维护跨会话的记忆

而微信作为国内最常用的即时通讯工具，自然成为了 Hermes 最重要的接入渠道之一。

## 微信适配器的特点

Hermes 的微信适配器使用腾讯的 **iLink Bot API**，专门针对个人微信账号（而非企业微信）。它的核心特点包括：

**无需公网暴露**
采用长轮询（long-poll）机制接收消息，不需要公网 IP、Webhook 或 WebSocket，只要有网络连接即可。

**扫码即连**
通过交互式向导完成配置，手机扫码即可登录，无需复杂的 API 密钥申请。

**全面的媒体支持**
支持发送和接收图片、视频、文件、语音消息，所有媒体通过 AES-128-ECB 加密 CDN 传输。

**智能消息处理**
- 长消息自动分块发送（最大 4000 字符）
- Markdown 格式自动转换为微信友好的格式
- 输入状态提示（"对方正在输入..."）
- 消息去重（5 分钟滑动窗口）

## 前置条件

开始配置前，你需要准备：

- 一个个人微信账号
- Python 环境
- 必要的 Python 包：`aiohttp` 和 `cryptography`

安装依赖：

```bash
pip install aiohttp cryptography

# 可选：终端显示二维码
pip install qrcode
```

## 配置步骤

### 第一步：运行安装向导

最简单的方式是使用 Hermes 的交互式安装向导：

```bash
hermes gateway setup
```

选择 **Weixin** 选项后，向导会：

1. 向 iLink Bot API 请求二维码
2. 在终端显示二维码（或提供 URL）
3. 等待你用微信 App 扫码
4. 提示你在手机上确认登录
5. 自动保存凭证到 `~/.hermes/weixin/accounts/`

连接成功后会显示：

```
微信连接成功，account_id=your-account-id
```

向导会自动存储 `account_id`、`token` 和 `base_url`，无需手动配置。

### 第二步：配置环境变量

扫码登录后，在 `~/.hermes/.env` 中设置至少账号 ID：

```bash
WEIXIN_ACCOUNT_ID=your-account-id

# 可选：覆盖 token（通常已从扫码登录自动保存）
# WEIXIN_TOKEN=your-bot-token

# 可选：访问控制
WEIXIN_DM_POLICY=open
WEIXIN_ALLOWED_USERS=user_id_1,user_id_2

# 可选：定时任务/通知的主频道
WEIXIN_HOME_CHANNEL=chat_id
WEIXIN_HOME_CHANNEL_NAME=Home
```

### 第三步：启动网关

```bash
hermes gateway
```

适配器会恢复已保存的凭证，连接到 iLink API，并开始长轮询接收消息。

## 访问权限控制

### 私聊策略

控制谁能给机器人发送私聊消息：

| 策略 | 行为 |
|------|------|
| `open` | 任何人都可以私聊（默认） |
| `allowlist` | 只有白名单用户可以私聊 |
| `disabled` | 忽略所有私聊 |
| `pairing` | 配对模式（用于初始设置） |

配置示例：

```bash
WEIXIN_DM_POLICY=allowlist
WEIXIN_ALLOWED_USERS=user_id_1,user_id_2
```

### 群聊策略

控制机器人在哪些群中响应：

| 策略 | 行为 |
|------|------|
| `open` | 在所有群中响应 |
| `allowlist` | 只在白名单群中响应 |
| `disabled` | 忽略所有群消息（默认） |

> 注意：微信个人账号的群策略默认为 `disabled`，因为个人微信可能加入了很多群，避免机器人在不相关的群中活跃。

配置示例：

```bash
WEIXIN_GROUP_POLICY=allowlist
WEIXIN_GROUP_ALLOWED_USERS=group_id_1,group_id_2
```

## 媒体文件处理

### 接收媒体

| 类型 | 处理方式 |
|------|----------|
| 图片 | 下载、AES 解密、缓存为 JPEG |
| 视频 | 下载、AES 解密、缓存为 MP4 |
| 文件 | 下载、AES 解密、保留原始文件名 |
| 语音 | 如有文字转录则提取文本，否则下载音频（SILK 格式） |

引用消息中的媒体也会被提取，让 AI 了解你在回复什么内容。

### 发送媒体

通过以下方法发送不同类型的媒体：

- `send` - 文本消息（支持 Markdown 格式化）
- `send_image` / `send_image_file` - 图片消息
- `send_document` - 文件附件
- `send_video` - 视频消息

所有出站媒体都经过加密 CDN 上传流程：
1. 生成随机 AES-128 密钥
2. 使用 AES-128-ECB + PKCS#7 填充加密文件
3. 向 iLink API 请求上传 URL
4. 将密文上传到 CDN
5. 发送带有加密媒体引用的消息

## 技术细节

### 长轮询机制

Hermes 微信适配器使用 HTTP 长轮询（不是 WebSocket）接收消息：

1. **连接**：验证凭证并启动轮询循环
2. **轮询**：调用 `getupdates`，超时 35 秒；服务器会保持请求直到有消息到达或超时
3. **分发**：通过 `asyncio.create_task` 并发分发消息
4. **同步**：持久化同步游标保存到磁盘，重启后从正确位置恢复

### 重试策略

| 情况 | 行为 |
|------|------|
| 瞬时错误（第 1-2 次） | 2 秒后重试 |
| 反复错误（第 3+ 次） | 退避 30 秒后重置计数器 |
| 会话过期（errcode=-14） | 暂停 10 分钟（可能需要重新登录） |
| 超时 | 立即重新轮询（正常的长轮询行为） |

### 上下文令牌持久化

iLink Bot API 需要在每条出站消息中回传 `context_token`。适配器维护了一个磁盘备份的上下文令牌存储：

- 令牌按账号+聊天对象保存到 `~/.hermes/weixin/accounts/<account_id>.context-tokens.json`
- 启动时恢复之前保存的令牌
- 每条入站消息更新该发送者的存储令牌
- 出站消息自动包含最新的上下文令牌

这确保了即使网关重启，回复的连续性也能保持。

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| 启动失败：缺少 aiohttp 和 cryptography | `pip install aiohttp cryptography` |
| 启动失败：缺少 WEIXIN_TOKEN | 运行 `hermes gateway setup` 完成扫码登录 |
| 启动失败：缺少 WEIXIN_ACCOUNT_ID | 在 `.env` 中设置或运行安装向导 |
| 另一个网关正在使用此 token | 先停止另一个网关实例 |
| 会话过期（errcode=-14） | 重新运行 `hermes gateway setup` 扫码 |
| 二维码过期 | 二维码会自动刷新最多 3 次，检查网络连接 |
| 机器人不回复私聊 | 检查 `WEIXIN_DM_POLICY` 设置 |
| 机器人忽略群消息 | 群策略默认禁用，设置 `WEIXIN_GROUP_POLICY=open` |
| 媒体下载/上传失败 | 确保安装了 cryptography，检查网络 |
| 消息重复 | 检查是否运行了多个网关实例 |

## 所有环境变量一览

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| WEIXIN_ACCOUNT_ID | ✅ | - | iLink Bot 账号 ID |
| WEIXIN_TOKEN | ✅ | - | iLink Bot token |
| WEIXIN_BASE_URL | - | https://ilinkai.weixin.qq.com | iLink API 基础 URL |
| WEIXIN_CDN_BASE_URL | - | https://novac2c.cdn.weixin.qq.com/c2c | CDN 基础 URL |
| WEIXIN_DM_POLICY | - | open | 私聊访问策略 |
| WEIXIN_GROUP_POLICY | - | disabled | 群聊访问策略 |
| WEIXIN_ALLOWED_USERS | - | (空) | 私聊白名单用户 ID |
| WEIXIN_GROUP_ALLOWED_USERS | - | (空) | 群聊白名单群 ID |
| WEIXIN_HOME_CHANNEL | - | - | 定时任务/通知的聊天 ID |
| WEIXIN_HOME_CHANNEL_NAME | - | Home | 主频道显示名称 |

## 总结

Hermes Agent 的微信适配器让个人微信账号变成了一个强大的 AI 控制终端。通过简单的扫码登录，你就可以：

- 用微信消息让 AI 执行代码
- 让 AI 帮你管理文件和浏览器
- 设置定时任务自动执行
- 在任何地方通过微信操控你的电脑

对于国内用户来说，微信是最自然的交互方式。不再需要切换到 Telegram 或 Discord，直接在微信里就能与你的 AI 助手对话。

---

*参考文档：[Hermes Agent - Weixin (WeChat)](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/weixin)*
*作者：兰秋十六 | [lanqiu.tech](https://lanqiu.tech)*