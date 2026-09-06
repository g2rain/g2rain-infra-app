# Components 与 Platform

## Components

`src/components` 提供查询表单、排序、远程选择、权限、HTTP、加载和微应用消息等复用能力。目标状态下它们不应直接读取 platform Store、runtime 资源或 views API，应用能力通过 props、provider、adapter 或组合根注入。

## Platform

`src/platform` 表达 Token、Locale、i18n、Store、错误模型和微前端协议。它可以依赖 components/shared，但目标状态下不依赖当前应用的 runtime/views。

## 变更要求

- 公共导出、props、事件、消息结构、Store 或环境契约变化必须说明兼容性。
- Token、Locale 和微应用事件变化同时验证 qiankun mount/update/unmount 与多实例隔离。
- 当前反向依赖见[已知偏差](../architecture/deviations.md)，迁移应小步进行并保持构建与运行行为。

