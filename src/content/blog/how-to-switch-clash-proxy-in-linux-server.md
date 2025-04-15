---
title: '如何在Linux服务器上切换Clash代理'
description: '如何在Linux服务器上切换Clash代理教程'
pubDate: 2025-01-02 22:12:32
tags: ["clash","proxy"]
---

## 如何在Linux服务器上切换Clash代理
Clash是一个开源的代理工具，它支持多种代理协议，如SOCKS5、HTTP、Shadowsocks等。在Linux服务器上，我们可以使用命令行工具curl来切换Clash代理。

### 使用curl命令切换Clash代理
在Linux服务器上，可以使用curl命令来切换Clash代理，例如:


###  获取当前配置

```bash
curl -X GET http://127.0.0.1:9090/proxies
```

### 切换代理

```bash
curl -X PUT http://127.0.0.1:9090/proxies/GLOBAL \
  -H "Content-Type: application/json" \
  -d '{"name":"🇯🇵 日本A01 | x0.8"}'
```

### 重启代理

```bash
 systemctl restart clash
```

### 测试

```bash
curl -x http://127.0.0.1:7890 https://ipinfo.io/ip
```

在上述命令中，`-X GET`表示使用GET方法获取当前配置，`-X PUT`表示使用PUT方法切换代理，`-H "Content-Type: application/json"`表示设置请求头为JSON格式，`-d '{"name":"🇯🇵 日本A01 | x0.8"}'`表示设置请求体为JSON格式的数据，其中`name`为代理名称，`🇯🇵 日本A01 | x0.8`为代理名称对应的值。
