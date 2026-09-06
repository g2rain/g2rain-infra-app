# 测试策略

## 当前基线

仓库当前只定义生产构建验证：

```bash
npm run build
```

2026-09-05 在按锁文件安装依赖后执行成功，覆盖 Vue/TypeScript 类型检查和 Vite 打包。仓库没有 `test`、`lint` script，也未发现自动化测试文件，因此不能把构建通过描述为功能测试通过。

## 按变化选择验证

| 变化 | 最低验证 |
| --- | --- |
| 类型、组件、页面 | `npm run build`，浏览器验证主要交互、空状态和错误路径 |
| 路由/资源 | 独立与 qiankun 模式；route-map、Basis 资源和权限状态 |
| Token/HTTP/SSO | 登录、过期、刷新失败、回调、Token update 与日志脱敏 |
| i18n | 至少两种语言、独立切换、主应用 Locale update 和回退文案 |
| 页面生成器 | 临时输入验证默认与 `--no-*`、重复执行及覆盖风险 |
| 资源生成器 | 页面/权限新增、删除、去重、动态表达式不生成和 JSON Diff |
| Docker/Nginx/Lua | 镜像、Context Path、静态资源、Gateway/IAM 代理、运行时注入和密钥挂载 |

## 待补齐

- 使用 Vitest 覆盖 shared 工具、解析器、Store、权限与 HTTP 规范化。
- 使用 Vue Test Utils 覆盖通用组件。
- 使用 Playwright 覆盖独立 SSO、qiankun 生命周期、多 Tab 和核心管理流程。
- 为两个生成器建立临时目录或快照测试。

