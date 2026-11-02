# 代码约定

- 使用 Vue Composition API 与 `<script setup lang="ts">`。
- TypeScript 保持 strict；新代码避免 `any`，第三方边界优先使用 `unknown` 与类型守卫。
- 目标依赖方向为 `views → runtime → platform → components → shared`。
- `main.ts` 与 `App.vue` 只承担组合根职责，不堆积领域逻辑。
- 复用模块通过 `index.ts` 暴露稳定公共 API，调用方避免深度导入内部实现。
- 环境与 URL 处理复用 shared 工具，不在页面散落 Context Path 拼接。
- 错误信息、路由标题和用户可见文本接入 i18n，并提供可理解的默认文案。
- 不提交 Token、私钥、真实个人数据、生产地址或 Secret。
- 修改源码行为、接口、配置、命令或部署方式时同步 README 和相关 docs。

现有违反分层或类型约定的代码见[架构偏差](../architecture/deviations.md)，不得作为新代码范例。

