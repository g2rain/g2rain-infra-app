# 依赖与协作

## 内部依赖

- `views` 使用 runtime/platform/components/shared 完成页面用例。
- `runtime` 组合资源加载、路由、认证、HTTP 和微前端运行态。
- `platform` 表达多个 g2rain App 共享的 Token、Locale、i18n 与应用协议。
- `components` 与 `shared` 是目标模型中的下层复用能力。
- 当前反向 import 已登记为架构偏差，不能作为新增代码范例。

## 外部协作

| 仓库/服务 | 关系 |
| --- | --- |
| `g2rain-main-shell` | 提供正式入口、`appKey`、Token、Client、Locale、初始路由和跨应用事件 |
| `g2rain-iam` | 提供独立模式 SSO、Token 与认证材料 |
| `g2rain-gateway-webflux` | 承接 `/api/` 业务请求并执行网关鉴权与转发 |
| `g2rain-basis` | 通过 `/basis/authority/resources` 下发页面、页面元素与 API 资源 |
| `g2rain-infra` | 拥有 `/infra/*` 对应的基础设施领域接口和数据 |

浏览器 App 不直接拥有任何后端数据；main-shell 提供的上下文也不能替代服务端校验。

