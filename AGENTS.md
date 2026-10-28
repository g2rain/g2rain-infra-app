# g2rain-infra-app Agent Instructions

本文件是 AI Coding 在本项目中的执行入口。事实来源位于 `docs`、当前源码、`package.json`、环境文件和部署文件。

## 项目定位

- 类型：Vue 3 平台基础设施管理微前端 App
- 项目事实：`docs/project.yaml`
- 文档入口：`docs/index.md`
- 目标中央 Profile：`frontend-app 1.0.0`
- 固定基线：`architecture-v1.1.0`
- 本项目偏差：`docs/architecture/deviations.md`

本项目承载发号器、字典用途与字典项、地区语言和国际化消息的管理界面。它负责前端用例、资源路由、权限呈现及双模式运行，不拥有 `g2rain-infra` 的领域数据和服务端规则，也不替代 IAM、Gateway 或 main-shell。

## 开始前

按任务范围读取：

1. `docs/project.yaml`
2. 中央 `frontend-app 1.0.0` Profile
3. `docs/architecture/deviations.md`
4. `docs/architecture/overview.md`
5. `docs/architecture/layers.md`
6. `docs/architecture/dependencies.md`
7. `docs/development/code-conventions.md`
8. `docs/development/testing.md`
9. `docs/development/definition-of-done.md`
10. 当前需求对应的 `docs/requirements`、`docs/design` 或 `docs/decisions`

涉及页面、组件、生成器、配置、认证、安全或部署时，继续读取对应专题文档。

## 实现约束

- 目标依赖方向是 `views -> runtime -> platform -> components -> shared`；组合入口为 `src/main.ts` 与 `src/App.vue`。
- 新代码不得扩大 `components -> platform/runtime`、`platform -> runtime`、`shared -> components/runtime` 等已登记偏差。
- 基础设施页面、页面 API、类型与 Mock 放在 `src/views/<domain>`，并同步 `src/views/route-map.ts`。
- 同时评估 qiankun 集成模式和独立模式；集成挂载要求显式 applicationCode/viewId/instanceId，认证经 Auth Bridge。
- 前端权限不能替代服务端授权；当前 `hasApiPermission` 直接返回 `true`，不可声称已实施 API 授权。
- 不提交 Token、私钥、真实凭据或生产敏感地址；生产环境禁用 Mock。
- `build:generate` 会覆盖文件。执行前确认工作区安全，执行后审查 view、API、type、mock 和 route-map。
- `build:config` 会覆盖已跟踪的资源 JSON；当前 API parser 未接入主流程，`apiEndpoints` 为空。

## 完成前

- 检查 Git Diff，排除无关格式化、调试代码、敏感信息和构建产物。
- 执行 `npm run build`；无法执行时说明原因和风险。
- 根据改动验证独立模式、qiankun 生命周期、Token/权限、路由和关键管理流程。
- 动态检查 Markdown 链接、`docs/project.yaml`、`package.json`、环境变量、脚本和源码一致性。
- 页面或权限变化检查 `route-map.ts` 与资源 JSON；生成器变化使用临时输入验证，避免覆盖真实页面。
- 按 `docs/development/definition-of-done.md` 报告已验证项、未验证项和剩余偏差。

