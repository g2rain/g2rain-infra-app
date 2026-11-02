# 故障排查

| 现象 | 检查项 |
| --- | --- |
| 构建提示找不到 `vue-i18n` 等依赖 | 删除陈旧依赖缓存并按锁文件执行 `npm ci --legacy-peer-deps`，不要用不完整的旧 `node_modules` 判断源码状态 |
| 直链不断跳转或 404 | 检查 `mode=alone`、Context Path、main-shell redirect prefix、entry 与 activeRule |
| 页面为空或路由不存在 | 检查 `VITE_APPLICATION_CODE`、`/basis/authority/resources` 返回和资源 `linkPath` 是否存在于 route-map |
| 按钮权限缺失 | 检查静态 `v-permission` 编码、Basis 页面元素资源与生成 JSON；动态表达式不会被可靠扫描 |
| API 返回 401/403 | 检查 Token/Client 注入、IAM SSO、Gateway 路由和服务端权限；前端权限不是鉴权依据 |
| qiankun 多 Tab 串路由 | 检查 main-shell 是否提供唯一 `appKey`，以及 update/unmount 是否配对清理 |
| 国际化文案缺失 | 检查 `VITE_I18N_TAGS`、Locale 接口、Tag 数据与回退文案 |
| 资源生成缺少 API | 当前 API parser 未接入主流程，这是已知限制，不要手工伪造为已生成 |
| 容器签名或公钥端点失败 | 检查受控密钥挂载、文件权限和 Lua/OpenResty 运行环境，禁止把私钥提交到仓库 |

