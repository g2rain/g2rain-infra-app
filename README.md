# g2rain-infra-app

## 1. 徽标与状态标识

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5.26-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![qiankun](https://img.shields.io/badge/qiankun-2.10.16-1f6feb)](https://qiankun.umijs.org/)

## 2. 项目简介

`g2rain-infra-app` 是 G2rain 平台中的基础设施与平台能力前端子应用，负责承载字典、国际化文案、区域设置、平台雨滴配置等基础管理页面，并为平台级配置与共享能力提供统一的前端交互入口。

## 3. 平台定位

在 G2rain“企业级 AI 原生开源 SaaS 平台”体系中，`g2rain-infra-app` 位于平台控制台子应用层，是平台基础设施类能力的前端承载应用。

它主要服务以下场景：
- 为平台运维、产品与实施人员提供基础配置与共享能力的管理界面
- 为 `g2rain-infra` 等基础设施服务提供对应的前端交互层
- 在开发阶段支持独立运行调试，在联调与交付阶段接入 `g2rain-main-shell`
- 通过 OpenResty + Lua 与统一认证体系协同，构成子应用的完整身份管理链路

它与 `g2rain-infra`、`g2rain-main-shell`、`g2rain-basis`、`g2rain-iam` 协同工作。

## 4. 核心能力

本章回答“这个仓库在平台里提供什么能力、解决什么问题”。

- 平台基础配置页面承载能力：解决平台字典、文案、区域设置等基础能力的可视化维护问题，通过 `src/views` 中的基础设施页面提供统一交互入口。
- 双模式运行能力：解决独立开发与主壳联调之间的切换问题，通过 `VITE_RUN_MODE`、qiankun 生命周期与主壳跳转逻辑支撑两种运行模式。
- 资源驱动路由装载能力：解决平台应用资源、菜单与页面路由的统一装载问题，通过运行时资源加载和动态路由生成按平台资源定义驱动页面访问。
- 统一认证与签名协同能力：解决平台基础子应用的 SSO、签名和接口访问安全问题，通过 IAM 公钥获取、Lua 签名与运行时 SSO 流程完成安全接入。
- 代码生成与资源配置能力：解决标准 CRUD 页面初始化与资源导入问题，通过 `build:generate` 和 `build:config` 支撑快速扩展。
- OpenResty 交付能力：解决前端子应用默认运行环境和部署方式统一的问题，通过 `Dockerfile`、`nginx`、`lua`、`build.sh` 提供标准交付入口。

## 5. 技术栈

- 语言与运行时：`TypeScript`、`Node.js 22+`
- 前端框架：`Vue 3.5.26`、`Vue Router 4.6.4`、`Pinia 3.0.4`
- 构建工具：`Vite 7.3.0`、`vue-tsc 3.2.1`
- 微前端：`qiankun 2.10.16`、`vite-plugin-qiankun 1.0.15`
- UI 与交互：`Element Plus 2.13.0`
- 国际化：`vue-i18n 11.4.4`
- 调试与模拟：`vite-plugin-mock`、`mockjs`
- 安全与签名：`jose`、`elliptic`、`crypto-js`
- 交付与运行：`Dockerfile`、`OpenResty`、`nginx`、`lua`、`build.sh`

## 6. 快速开始

### 环境要求

- `Node.js 22+`
- `npm 10+`
- 可联通的后端服务与统一认证环境
- 如需镜像构建，需可用的 `Docker`

### 关键环境变量

| 变量名 | 说明 | 典型用途 |
| --- | --- | --- |
| `VITE_APPLICATION_CODE` | 应用编码 | 当前值 `g2rain-infra-app` |
| `VITE_CONTEXT_PATH` | 部署上下文路径 | 当前值 `/infra` |
| `VITE_BACKEND_ORIGIN` | 后端服务地址 | 本地代理目标 |
| `VITE_TOKEN_END_POINT` | Token 接口路径 | 默认 `/auth/token` |
| `VITE_AUTH_END_POINT` | 授权接口路径 | 默认 `/auth/authorize` |
| `VITE_SERVER_PORT` | 本地开发端口 | 当前值 `3000` |
| `VITE_SSO_BASE_URL` | SSO 根地址 | 登录跳转与回调 |
| `VITE_REDIRECT_URI` | 回调路径 | 默认 `/sso_callback` |
| `VITE_RUN_MODE` | 运行模式 | `alone` 为独立运行，留空为集成意图 |
| `VITE_MAIN_SHELL_REDIRECT_PREFIX` | 主壳网关前缀 | 默认 `/main/redirect` |
| `VITE_MAIN_SHELL_ORIGIN` | 主壳本地地址 | 本地联调时使用 |
| `VITE_I18N_TAGS` | 国际化文案标签 | 当前值 `G2RAIN_SHARED,INFRA` |

### 运行模式说明

- 开发阶段可设置 `VITE_RUN_MODE=alone` 独立运行，方便单独调试页面。
- 联调阶段应部署到测试环境并接入 `g2rain-main-shell`，通过主壳完成完整认证、路由与资源联调验证。
- 当未设置 `VITE_RUN_MODE=alone` 且页面并非由 qiankun 挂载时，应用会先跳转到主壳网关入口。

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 构建产物

```bash
npm run build
npm run preview
```

### 代码生成与资源配置

```bash
npm run build:generate -- --tables=dict
npm run build:config
```

### 镜像构建

```bash
./build.sh
./build.sh --tag latest --build-mode production
```

## 7. 项目结构

本章回答“代码与模块是如何组织的、排查和扩展时应该先看哪里”。

```text
g2rain-infra-app/
├── src/
│   ├── components
│   ├── platform
│   ├── runtime
│   ├── shared
│   └── views
├── lua/
├── nginx/
├── Dockerfile
├── build.sh
├── vite.config.ts
├── .env
└── .env.production
```

### 结构说明

- `src/components`：通用组件、HTTP 封装、权限组件与签名相关实现。
- `src/platform`：平台级适配层，承载 qiankun 生命周期、全局状态、国际化与错误处理。
- `src/runtime`：运行时引导层，承载 SSO、资源初始化、动态路由与启动流程。
- `src/shared`：通用工具层，承载运行模式判断、生成器、资源配置扫描和环境变量封装。
- `src/views`：基础设施类业务页面，默认按“一个表一个目录”的规范组织。
- `lua`：OpenResty Lua 脚本，承载 IAM 公钥获取、应用私钥签名等能力。
- `nginx`：默认运行环境配置，使用 OpenResty 并内置 Lua 支持。
- `build.sh` 与 `Dockerfile`：默认交付入口。

### src/views 模块说明

- `auth`：认证与回调相关页面。
- `dict`：字典管理页面。
- `dictionary_usage`：字典使用情况或关联展示页面。
- `g2rain_raindrop`：平台雨滴或平台配置项相关页面。
- `i18n_message`：国际化文案管理页面。
- `locale_setting`：区域与语言设置页面。

### 页面组织规范

- 默认根据数据库表生成页面，每个 `table` 对应 `src/views/<table>` 一个目录。
- 目录内通常包含 `index.vue`、`api.ts`、`type.ts`，按需补充 `mock.ts`。
- 如需新增业务页面，也建议继续遵循该规范，以便 `build:config` 稳定扫描资源。

## 8. 核心业务流程

本章回答“这些能力在运行时是如何串起来工作的”。

#### 1. 独立运行与主壳集成主线

- 开发阶段设置 `VITE_RUN_MODE=alone` 时，应用直接独立运行。
- 集成意图下如果当前并非 qiankun 挂载，应用会先跳转到 `g2rain-main-shell` 网关入口。
- 由 qiankun 正式挂载后，生命周期适配层接管路由初始化、主壳消息处理和实例隔离。

#### 2. 资源加载与动态路由主线

- 启动后先执行运行时 boot 流程。
- 应用依据 `VITE_APPLICATION_CODE` 拉取平台资源、页面元素和路由资源。
- `initRoutesFromResources` 生成资源路由并注入应用实例。
- 最终菜单、路由和权限资源保持平台同源一致。

#### 3. SSO 与签名认证主线

- 运行时检测到未登录时，先跳转统一认证入口。
- 回调完成后重新加载资源并恢复目标页面。
- 涉及安全签名的请求通过 `/keys/iam-key-id`、`/keys/iam-public-key`、`/lua/sign_code` 与 OpenResty Lua 协同完成。
- 这条主线构成前端子应用完整的身份与安全访问链路。

#### 4. 页面生成与资源导入主线

- 开发者执行 `npm run build:generate -- --tables=<table>` 生成页面骨架。
- 生成器输出 `src/views/<table>` 下的页面、接口、类型与可选 mock。
- 开发完成后执行 `npm run build:config`。
- 配置工具扫描页面、接口、按钮权限和路由，输出可导入平台的资源配置文件。

#### 5. OpenResty 交付主线

- `Dockerfile` 先用 Node 阶段构建前端产物。
- 运行阶段使用 OpenResty 承载静态资源与 Lua 脚本。
- `nginx/default.conf.template` 提供静态资源服务与认证相关代理路径。
- `lua/sign.lua`、`lua/sign_api.lua` 完成签名与密钥协作能力。

## 9. 常用命令

```bash
npm run dev
npm run build
npm run preview
npm run build:generate -- --tables=dict
npm run build:config
./build.sh
./build.sh --image g2rain/g2rain-infra-app --tag latest --build-mode production
```

## 10. 质量与测试

- 当前仓库已具备统一前端子应用骨架、主壳集成模式、签名链路和资源驱动路由能力。
- 当前扫描未发现独立测试体系说明，后续建议优先补齐运行模式切换、国际化文案加载、SSO 回调与资源配置扫描的关键测试。
- 涉及主壳联调、国际化资源与签名访问时，建议在测试环境完成完整验证。

## 11. 相关仓库

- `g2rain-infra`：平台基础设施后端服务
- `g2rain-main-shell`：主壳与统一入口
- `g2rain-basis`：平台应用、资源、角色与权限底座
- `g2rain-app-template`：前端子应用模板来源之一

## 12. 使用建议

- 开发期优先用 `alone` 模式快速调试页面。
- 联调期优先接入主壳验证认证、资源、路由和权限链路。
- 对于平台基础配置类新页面，建议继续遵循“按表生成目录”的方式，减少维护成本。
- 对于国际化和字典类页面，建议同步关注 `VITE_I18N_TAGS` 与平台文案资源的一致性。

## 13. 贡献指南

欢迎通过文档改进、Issue 反馈、测试补充、代码优化、功能增强等形式参与贡献。

建议流程：
1. Fork 本仓库
2. 创建特性分支
3. 提交修改
4. 推送分支
5. 提交 Pull Request

提交前请尽量确保：
- 遵循现有技术栈与代码规范
- 补充必要测试
- 更新相关文档
- 确保测试通过

## 14. 许可证

本项目基于 [Apache 2.0许可证](LICENSE) 开源。

## 15. 联系我们

- **站点**: https://www.g2rain.com/
- **Issues**: [GitHub Issues](https://github.com/g2rain/g2rain/issues)
- **讨论**: [GitHub Discussions](https://github.com/g2rain/g2rain/discussions)
- **邮箱**: g2rain_developer@163.com

## 16. 致谢

感谢所有为这个项目做出贡献的开发者们。

如果这个项目对您有帮助，欢迎 Star 支持。
