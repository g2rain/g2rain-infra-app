# 运行流程

## 集成模式

1. main-shell 通过 qiankun 调用 `bootstrap` 与 `mount`。
2. `mount` 校验容器和唯一 `appKey`，创建隔离的 Vue/Router 实例。
3. 应用先接收 Token、Client 和 Locale，再从 Basis 加载资源。
4. 后端页面资源与 `src/views/route-map.ts` 匹配后注册路由。
5. 页面通过 Gateway 调用 `/infra/*` 接口；路由变化以结构化事件通知主应用。
6. `update` 刷新 Token、Locale、资源和初始路由；`unmount` 清理实例与 watcher。

## 独立模式

1. URL `mode=alone` 优先，其次读取 `VITE_RUN_MODE=alone`。
2. 应用执行 IAM SSO；回调成功后初始化 Token 与资源。
3. 使用自身 history/router 运行页面。

未显式选择 `alone` 且没有处于 qiankun 生命周期时，应用把直链包装到 `VITE_MAIN_SHELL_REDIRECT_PREFIX` 并跳转到 main-shell。

