# 已知架构偏差

本项目计划采用 g2rain `frontend-app 1.0.0`。本页记录当前源码相对中央 Profile 的偏差；新增需求不得扩大这些偏差。

## DEV-001：components 反向依赖 platform/runtime/views

状态：待迁移。

`components` 中的错误文案、RemoteSelect、HTTP 拦截器和 Mock 直接引用 platform Store/i18n、runtime 资源类型或 `views/dict/api`。应通过 props、provider、接口和组合根注入平台/领域能力。

## DEV-002：platform 反向依赖 runtime

状态：待迁移。

`platform/i18n`、Locale Store 和 qiankun adapter 直接调用 runtime API、boot、router 或 micro-shells。应由 runtime/组合根向 platform 注册 provider 与生命周期回调。

## DEV-003：runtime 直接引用 views

状态：接受为当前组合方案，目标是依赖反转。

`runtime/boot/router.ts` 引用 `views/route-map.ts`，系统路由引用 Home 与 SSO Callback。建议由 views 导出注册表并在组合根注入。

## DEV-004：类型边界存在显式 any

状态：渐进治理。

虽然 `tsconfig` 启用 strict，qiankun/window、HTTP、错误、Mock 与部分页面仍使用 `any`。新代码优先使用 `unknown`、泛型、类型守卫和模块扩展。

## DEV-005：环境默认值存在历史项目残留与端口不一致

状态：待修正。

`shared/env.ts` 的默认应用编码仍为 `g2rain-manager-app`，实际 `.env` 为 `g2rain-infra-app`；`.env` 端口为 3000，而 Vite 未读取到进程变量时回退 3001；Docker `EXPOSE 8080`，入口默认监听 80。部署必须显式设置配置，避免回退到错误值。

## DEV-006：API 资源权限与生成尚未启用

状态：功能未完成。

资源生成主流程注释了 API parser，当前仅写出 `resources.json`、`pages.json` 和 `page-elements.json`，其中 API 端点为空；运行时 `hasApiPermission` 当前固定返回 `true`。前端 API 权限不应被描述为已生效，最终安全边界仍在 Gateway/服务端。

## DEV-007：生产构建存在分块与体积警告

状态：构建通过，待专项优化。

2026-09-05 构建报告 SSO 重导出循环分块、多个静态/动态 import 交织、MockJS `eval`、经典 `env-config.js` 无法打包和约 1.63 MB 主 JavaScript Chunk。应先解除依赖循环并隔离生产 Mock，再设计稳定分包和 CSP/缓存策略。

## DEV-008：缺少自动化测试与 lint

状态：待补齐。

仓库未配置 `test` 或 `lint` script，也未发现自动化测试文件。当前 `npm run build` 只覆盖 Vue/TypeScript 类型检查和 Vite 打包，不覆盖浏览器、认证、权限、生成器和容器联调。

