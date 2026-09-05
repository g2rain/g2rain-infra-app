# 层次与职责

目标依赖方向为：

```text
views → runtime → platform → components → shared
```

| 层次 | 当前职责 |
| --- | --- |
| `src/shared` | 环境、URL、模式等基础工具，以及仅在构建期执行的页面/资源生成工具 |
| `src/components` | 查询表单、排序、远程选择、权限、HTTP、加载和微应用消息等复用能力 |
| `src/platform` | Token、Locale、i18n、Store、错误模型和 qiankun 协议 |
| `src/runtime` | 当前应用认证、HTTP、资源加载、路由、启动和多实例运行态 |
| `src/views` | 发号器、字典、地区语言、国际化消息页面及页面本地 API/类型 |
| `src/main.ts`、`src/App.vue` | 组合根，装配 Vue、Pinia、i18n、权限、路由和微前端生命周期 |

当前存在 components/platform/runtime 的反向依赖，详见[已知偏差](deviations.md)。新增代码不得继续扩大偏差。

