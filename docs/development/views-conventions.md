# Views 约定

## 页面模块

业务页面位于 `src/views/<module>`，通常包含：

```text
index.vue
api.ts
type.ts
mock.ts       # 可选
components/   # 页面局部组件，可选
```

- `index.vue` 组合页面交互，不复制 HTTP Client 实现。
- `api.ts` 表达后端真实用例，使用 `/infra/*` 业务路径。
- `type.ts` 区分读取模型、查询条件和写入 Payload，后端大整数按接口契约建模。
- 页面局部组件保留在当前页面目录，避免跨 views 深度导入。
- Mock 只在显式开发模式启用，不复制生产数据。

## 路由与权限

- 页面必须在 `src/views/route-map.ts` 静态注册，路径与 Basis 页面资源 `linkPath` 一致。
- 当前正式页面为 `/g2rain_raindrop`、`/dictionary_usage`、`/locale_setting`、`/i18n_message`。
- 按钮权限采用可静态扫描的 `v-permission="'resource:action'"` 形式。
- 动态权限表达式不会被资源生成器可靠识别，需要明确的手工登记方案。
- 页面与权限变化后运行 `npm run build:config`，逐项 Review 新增、修改与删除。

