# 资源配置生成

资源工具静态扫描 `src/views/route-map.ts` 与各路由目录中的 Vue 文件，写入 `src/shared/config-util/config`。

```bash
npm run build:config
```

当前实际生成：

- `resources.json`：页面、页面元素以及空的 `apiEndpoints` 数组；
- `pages.json`：路由页面；
- `page-elements.json`：静态 `v-permission` 权限点。

## 当前限制

- API parser 文件虽然存在，但主流程和 `api-endpoints.json` 写入均被注释，不能声称 API endpoint 生成已启用。
- 路由 parser 依赖可识别的静态对象写法；复杂计算或任意动态 import 可能无法解析。
- 权限仅扫描对应页面目录的 `.vue` 文件，要求静态值且包含冒号；动态表达式会被跳过。
- JSON 删除也可能来自扫描失败，不能自动等同资源下线。
- 运行时 API 权限检查当前固定放行，前端资源配置不替代服务端鉴权。

生成后必须 Review JSON Diff，并在测试环境验证导入、去重、状态与回滚。

