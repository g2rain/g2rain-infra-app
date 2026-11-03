# 配置

## 浏览器公开配置

所有 `VITE_*` 变量及 `window._env_` 对浏览器可见，只能承载公开配置。

| 配置 | 作用 |
| --- | --- |
| `VITE_APPLICATION_CODE` | Basis 资源加载使用的应用编码，当前为 `g2rain-infra-app` |
| `VITE_CONTEXT_PATH` | Vite base 与部署子路径，当前为 `/infra` |
| `VITE_BACKEND_ORIGIN` | 本地开发代理目标 |
| `VITE_TOKEN_END_POINT`、`VITE_AUTH_END_POINT` | IAM Token 与授权路径 |
| `VITE_SSO_BASE_URL`、`VITE_REDIRECT_URI` | 独立模式 SSO 与回调 |
| `VITE_RUN_MODE` | `alone` 表示独立模式，空值表示集成意图 |
| `VITE_MAIN_SHELL_REDIRECT_PREFIX` | 非 qiankun 直链跳转到 main-shell 的路径前缀 |
| `VITE_MAIN_SHELL_ORIGIN` | 本地跨端口开发时 main-shell Origin |
| `VITE_I18N_TAGS` | 从后端加载的国际化 Tag 列表 |
| `VITE_MOCK_ENABLED` | 显式开发 Mock 开关 |

URL 的 `mode=alone` 优先于环境变量。

## 容器配置

| 配置 | 作用 |
| --- | --- |
| `SERVER_PORT` | OpenResty 监听端口；入口默认 80，部署建议与端口映射显式一致 |
| `CONTEXT_PATH` | Nginx 子路径，应与构建的 Context Path 一致 |
| `GATEWAY_HOST`、`GATEWAY_PORT` | `/api/` 与 `/doc/` 代理目标 |
| `IAM_HOST`、`IAM_PORT` | `/auth/` 代理目标 |
| `SSO_BASE_URL` | 写入生成的 `env-config.js` 的公开 SSO 地址 |

密钥文件通过部署 Secret/Volume 提供，不能写入环境公开配置或镜像源码层。

