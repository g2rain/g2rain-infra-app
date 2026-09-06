# 安全边界

- Token、Refresh Token、Client 私钥、Cookie、验证码和生产 Secret 不进入源码、Bundle、公开配置、Mock、日志或文档。
- `VITE_*` 和 `window._env_` 都是浏览器公开数据，不能承载 Secret。
- 集成模式接收的 Token 与 Client 仍须由 Gateway/服务端验证；前端路由和 `v-permission` 只改善交互体验。
- 独立模式的 SSO Redirect URI、Context Path、Origin 和状态参数必须精确匹配，避免回调循环和开放重定向。
- 多实例必须以 `appKey` 隔离 Vue、Router 和状态，并在 unmount 清理 watcher 与事件。
- DPoP 计算应与实际方法、URL、查询串、Content-Type 和请求体字节一致；私钥只通过受控部署机制提供。
- 当前运行时 API 权限检查固定返回 `true`，不能把它视为安全控制。
- Mock、生成 SQL 和示例不得复制生产数据。
- 镜像中的 Lua/OpenSSL 供应链、`eval` 警告、运行时脚本 CSP 与依赖漏洞需纳入发布审查。
- 安全漏洞通过 GitHub Security Advisory 私密报告，不在公开 Issue 披露利用细节。

