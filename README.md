<p align="center">
  <img src="https://github.com/g2rain.png" alt="G2Rain" width="180" />
</p>

# g2rain-infra-app

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.5.26-42B883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Qiankun](https://img.shields.io/badge/micro--frontend-Qiankun-1677FF)](https://qiankun.umijs.org/)

> 下一代AI软件开发范式，AI原生Agent平台，开源的企业级SaaS底座。

平台基础设施管理微前端子应用，提供发号器、字典、地区语言与国际化消息管理界面，并以动态资源路由和 qiankun 生命周期接入 g2rain-main-shell。

[项目文档](docs/index.md) · [官网](https://www.g2rain.com) · [Issues](https://github.com/g2rain/g2rain/issues) · [Discussions](https://github.com/g2rain/g2rain/discussions)

## 目录

- 项目简介
- 平台定位
- 应用角色
- 功能概览
- 技术栈
- 环境要求
- 快速开始
- 配置说明
- 双运行模式
- 页面代码生成
- 资源配置生成
- 构建与镜像
- 代码质量与测试
- 运行示例
- 主要页面与后端接口
- 安全边界
- 故障排查
- 与关联仓库的关系
- 模块说明
- 职责边界
- 参与贡献
- 许可证
- 联系我们
- 致谢

## 项目简介

`g2rain-infra-app` 是 `g2rain-infra` 的管理端前端，面向平台管理员提供发号器、字典用途与字典项、地区语言和国际化消息维护。应用从 Basis 加载页面资源，在集成模式下由 main-shell 装载，在独立模式下自行完成 IAM SSO，并统一经 Gateway 调用 Infra 后端。

## 平台定位

该仓库位于 g2rain 前端应用层，属于 `frontend-foundation-app`，目标采用中央 `frontend-app 1.0.0`（固定快照 `architecture-v1.1.0`）。它不是 main-shell，也不承担后端基础设施服务职责。

## 应用角色

该仓库聚焦于平台基础设施配置的管理端交互。

主要流程包括：
- 从 Basis 加载资源并与本地路由映射注册流程
- 子应用挂载与卸载生命周期流程
- 子应用路由同步流程
- 令牌请求、响应与失效事件流程
- Qiankun 运行时初始化与 `appKey` 多实例隔离流程

## 功能概览

| 能力 | 说明 |
| --- | --- |
| 分布式发号器管理 | 提供发号器配置页面，维护平台统一编号生成能力。 |
| 字典用途管理 | 维护字典用途及字典项的本地化选项。 |
| 地区语言配置 | 维护平台支持的地区与语言配置。 |
| 国际化信息管理 | 维护多语言消息并为平台应用提供国际化资源。 |
| 平台运行时接入 | 支持动态资源路由、认证态、国际化与 qiankun 子应用生命周期。 |

## 技术栈

| 类别 | 说明 |
| --- | --- |
| 运行时 | Node.js 22+、npm |
| 前端框架 | vue、vue-router、pinia、vue-i18n、element-plus |
| 构建与类型 | vite、typescript、vue-tsc |
| 微前端 | qiankun、vite-plugin-qiankun |
| 接口与模拟 | axios、mockjs、vite-plugin-mock |
| 部署 | Docker、Nginx |

## 环境要求

- Node.js >=22
- npm
- Docker（构建镜像时需要）

## 快速开始

| 步骤 | 命令或位置 | 说明 |
| --- | --- | --- |
| 安装依赖 | `npm ci --legacy-peer-deps` | 按 `package-lock.json` 安装可复现依赖。 |
| 本地开发 | `npm run dev` | 启动本地开发服务；默认 Context Path 为 `/infra`。 |
| 构建产物 | `npm run build` | 执行类型检查与前端构建，生成可发布产物。 |
| 预览产物 | `npm run preview` | 在本地预览构建后的前端产物。 |
| 页面生成 | `npm run build:generate -- --tables=<table>` | 根据仓库内 DDL 生成页面骨架；执行前先检查 Git 状态。 |
| 资源生成 | `npm run build:config` | 从静态路由和权限指令生成页面/页面元素 JSON。 |

版本号以项目构建配置为准，当前识别为 `0.1.0`。

## 配置说明

所有 `VITE_*` 与 `window._env_` 配置都对浏览器可见，不能存放 Secret。

| 类别 | 配置项 | 说明 |
| --- | --- | --- |
| 应用 | `VITE_APPLICATION_CODE` | Basis 资源加载使用的应用编码，当前为 `g2rain-infra-app`。 |
| 路径 | `VITE_CONTEXT_PATH` | Vite base 与部署子路径，当前为 `/infra`。 |
| 模式 | `VITE_RUN_MODE` | `alone` 表示独立模式，空值表示集成意图；URL `mode=alone` 优先。 |
| 平台 | `VITE_SSO_BASE_URL`、`VITE_REDIRECT_URI` | 独立模式 SSO 与回调地址。 |
| 平台 | `VITE_MAIN_SHELL_REDIRECT_PREFIX`、`VITE_MAIN_SHELL_ORIGIN` | 集成意图下的 main-shell 直链网关。 |
| 国际化 | `VITE_I18N_TAGS` | 后端国际化消息 Tag，默认项目配置为 `G2RAIN_SHARED,INFRA`。 |
| 开发 | `VITE_BACKEND_ORIGIN`、`VITE_SERVER_PORT`、`VITE_MOCK_ENABLED` | 本地代理、端口与显式 Mock 开关。 |
| 容器 | `SERVER_PORT`、`CONTEXT_PATH` | OpenResty 监听端口与部署子路径。 |
| 容器 | `GATEWAY_HOST/PORT`、`IAM_HOST/PORT` | `/api/`、`/doc/` 与 `/auth/` 的代理目标。 |

完整说明见[配置文档](docs/operations/configuration.md)。

## 双运行模式

### 集成模式（正式入口）

main-shell 通过 qiankun 提供容器、唯一 `appKey`、Token、Client、Locale、初始路由和 activeRule。应用先建立认证上下文，再从 `/basis/authority/resources` 加载页面资源；`update` 可处理 Token、语言、资源与路由变化，`unmount` 清理实例和 watcher。

### 独立模式（开发与诊断）

在 URL 增加 `mode=alone`，或配置 `VITE_RUN_MODE=alone`。应用自行执行 IAM SSO、Token 和资源初始化。没有显式选择独立模式且未被 qiankun 挂载时，直链会跳转 main-shell 网关。

## 页面代码生成

生成器从 `src/shared/generator/database.sql` 读取 MySQL DDL：

```bash
npm run build:generate -- --tables=g2rain_raindrop
```

多个表可使用逗号分隔。默认生成/覆盖 `src/views/<table>` 下的 `index.vue`、`api.ts`、`type.ts`、`mock.ts`，并更新 `src/views/route-map.ts`。可使用 `--no-view`、`--no-api`、`--no-mock`、`--no-route` 关闭阶段。

生成器会直接覆盖同名文件。执行前必须检查 Git 状态，生成后人工校正接口用例、Payload、ID、权限、国际化和敏感字段，再 Review Diff 并运行构建。详见[页面代码生成](docs/development/code-generation.md)。

## 资源配置生成

```bash
npm run build:config
```

当前命令扫描 `src/views/route-map.ts` 和路由目录中的静态 `v-permission`，写入：

- `src/shared/config-util/config/resources.json`
- `src/shared/config-util/config/pages.json`
- `src/shared/config-util/config/page-elements.json`

API parser 当前没有接入主流程，`apiEndpoints` 为空，也不会生成 `api-endpoints.json`。动态路由和动态权限表达式可能无法识别；任何 JSON 删除都必须人工判断是资源下线还是扫描失败。详见[资源配置生成](docs/development/resource-generation.md)。

## 构建与镜像

| 目标 | 命令 | 产物 | 说明 |
| --- | --- | --- | --- |
| 本地开发 | `npm run dev` | 本地开发服务 | 启动前端本地开发服务。 |
| 前端产物 | `npm run build` | `dist` | 执行类型检查与 Vite/TypeScript 构建，生成可发布产物。 |
| 产物预览 | `npm run preview` | 本地预览服务 | 在本地预览构建后的前端静态产物。 |
| 容器镜像 | `docker build --build-arg VITE_BUILD_MODE=production -t g2rain/g2rain-infra-app:<tag> .` | OpenResty 前端镜像 | 构建静态产物、反向代理和 Lua 签名运行环境。 |
| 构建脚本 | `./build.sh --tag <tag> --build-mode production` | `g2rain/g2rain-infra-app:<tag>` | 封装 Docker BuildKit 镜像构建。 |

## 代码质量与测试

| 检查项 | 命令 | 说明 |
| --- | --- | --- |
| Vue 类型检查与生产打包 | `npm run build` | 依次执行 `vue-tsc` 与 Vite build。2026-09-05 在按锁文件安装依赖后验证通过。 |

仓库当前没有 `test` 或 `lint` script，也未发现自动化测试文件。构建通过不等于页面、浏览器、认证、权限、微前端或容器联调通过。当前构建仍有循环分块、MockJS `eval`、经典 `env-config.js` 和约 1.63 MB 主包警告，详见[测试策略](docs/development/testing.md)与[架构偏差](docs/architecture/deviations.md)。

## 运行示例

| 示例 | 方法 | 路径 | 用途 | 调用示例 |
| --- | --- | --- | --- | --- |
| 平台前端应用本地开发 | npm | `npm run dev` | 启动前端本地开发服务，便于联调页面、路由和平台运行时能力。 | `npm run dev -- --host 0.0.0.0` |
| 平台前端应用构建 | npm | `npm run build` | 执行类型检查和前端构建，生成可部署的静态产物。 | `npm run build` |
| 平台前端应用预览 | npm | `npm run preview` | 在本地预览构建后的前端产物。 | `npm run preview` |

## 主要页面与后端接口

| 页面路由 | 管理能力 | 代表性后端路径 |
| --- | --- | --- |
| `/g2rain_raindrop` | 发号器配置、业务 Tag 查询 | `/infra/g2rain_raindrop/page`、`/save`、`/{id}`、`/biz_tag_dict` |
| `/dictionary_usage` | 字典用途及字典项维护 | `/infra/dictionary_usage/*`、`/infra/dictionary_item/list|page|tree|save|{id}` |
| `/locale_setting` | 地区语言与语言国家选项 | `/infra/locale_setting/*`、`/locale_dict`、`/get_language_countries` |
| `/i18n_message` | 国际化消息、用途与 Tag | `/infra/i18n_message/*`、`/i18n_message_usages`、`/tag_dict` |

这些路径由浏览器 HTTP Client 经 Gateway 调用。具体请求方法、Payload 和权限以当前 `src/views/*/api.ts` 与后端契约为准。

## 安全边界

- `VITE_*`、`window._env_` 和前端 Bundle 都是公开边界，不存放 Token、私钥或生产 Secret。
- 页面路由和 `v-permission` 只控制前端呈现，最终鉴权、租户与数据权限由 Gateway 和服务端执行。
- DPoP 必须覆盖实际方法、URL、参数和请求体字节；签名私钥通过受控 Secret/Volume 提供。
- qiankun 多实例使用唯一 `appKey` 隔离状态，并在 unmount 清理监听与 watcher。
- 当前 `hasApiPermission` 固定返回 `true`，不能将前端 API 资源检查描述为已启用。

详见[安全边界](docs/security/security-boundaries.md)。

## 故障排查

| 现象 | 建议检查 |
| --- | --- |
| 构建找不到已声明的依赖 | 使用 `npm ci --legacy-peer-deps` 按锁文件同步依赖，避免沿用陈旧 `node_modules`。 |
| 直链跳转循环或 404 | 核对 `mode=alone`、Context Path、main-shell redirect prefix、entry 与 activeRule。 |
| 页面为空或路由不存在 | 核对应用编码、Basis 资源响应及资源 `linkPath` 与 route-map。 |
| 按钮权限缺失 | 核对静态权限编码、页面元素资源和生成 JSON；动态表达式不会被可靠扫描。 |
| API 401/403 | 核对 Token/Client、IAM、Gateway 和服务端权限；不要用前端隐藏按钮代替鉴权。 |
| 资源生成没有 API endpoint | 当前功能未接入主流程，这是已登记限制。 |

更多场景见[故障排查文档](docs/operations/troubleshooting.md)。

## 与关联仓库的关系

本仓库由 `g2rain-main-shell` 统一装载，通过 `g2rain-iam` 建立认证，通过 `g2rain-basis` 获取页面与权限资源，再经 Gateway 调用 `g2rain-infra` 完成基础设施管理操作。

| 仓库 | 协作关系 |
| --- | --- |
| `g2rain-main-shell` | 正式入口、Tab、初始路由、Token/Locale 上下文和 qiankun 生命周期 |
| `g2rain-iam` | 独立模式 SSO、Token 与客户端认证 |
| `g2rain-gateway-webflux` | `/api/` 业务请求的鉴权与转发 |
| `g2rain-basis` | `/basis/authority/resources` 页面、页面元素与 API 资源 |
| `g2rain-infra` | 发号器、字典、地区语言和国际化消息的后端领域能力 |

## 模块说明

| 模块 | 职责说明 | 代码线索 |
| --- | --- | --- |
| 复用组件 | 查询表单、排序、远程选择、权限、HTTP、加载和微应用消息。 | `src/components` |
| 平台协议 | Token、Locale、i18n、Store、错误模型与 qiankun 适配。 | `src/platform` |
| 应用运行时 | SSO、HTTP、资源加载、路由、启动和多实例状态。 | `src/runtime` |
| 构建期与基础工具 | 环境/URL/模式工具，以及页面和资源配置生成器。 | `src/shared` |
| 基础设施管理页面 | 发号器、字典用途/字典项、地区语言和国际化消息页面与 API。 | `src/views` |

## 职责边界

该仓库主要负责：

- 基础设施管理页面、页面本地 API/类型与交互用例。
- 本应用资源加载、路由注册、权限呈现、国际化和双运行模式。
- qiankun 子应用生命周期以及向主应用报告本应用路由变化。
- 本项目页面代码与资源配置生成工具。

该仓库默认不负责：

- 不负责 main-shell 的全局布局、菜单、Tab 或其他子应用编排。
- 不拥有 `g2rain-infra` 的数据、编号算法和服务端业务规则。
- 不替代 IAM、Gateway、Basis 或 Infra 的认证、授权、租户和数据校验。
- 不把生成代码或前端权限配置视为后端契约与安全事实。

## 参与贡献

我们欢迎所有形式的贡献：Issue 反馈、文档改进、功能建议与代码提交。

推荐流程：

1. Fork 本仓库。
2. 创建特性分支：`git checkout -b feature/your-feature-name`。
3. 提交更改：`git commit -m "Add some feature"`。
4. 推送分支：`git push origin feature/your-feature-name`。
5. 提交 Pull Request。

代码贡献前请尽量补充必要的测试和文档，并确保构建、测试与静态检查通过。

## 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源。

## 联系我们

- Issues: [GitHub Issues](https://github.com/g2rain/g2rain/issues)
- 讨论: [GitHub Discussions](https://github.com/g2rain/g2rain/discussions)
- 邮箱: g2rain_developer@163.com

## 致谢

感谢所有为 g2rain 项目提交 Issue、代码、文档、建议和使用反馈的开发者们！
