<p align="center">
  <img src="https://github.com/g2rain.png" alt="G2Rain" width="180" />
</p>

# g2rain-infra-app

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.5.26-42B883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Qiankun](https://img.shields.io/badge/micro--frontend-Qiankun-1677FF)](https://qiankun.umijs.org/)

下一代AI软件开发范式，AI原生Agent平台，开源的企业级SaaS底座。

平台基础设施管理微前端子应用，提供发号器、字典用途、地区语言与国际化信息管理界面；通过动态资源路由和 qiankun 生命周期接入 g2rain-main-shell

[官网](https://www.g2rain.com) · [Issues](https://github.com/g2rain/g2rain/issues) · [Discussions](https://github.com/g2rain/g2rain/discussions)

## 目录

- 项目简介
- 平台定位
- 应用角色
- 功能概览
- 技术栈
- 环境要求
- 快速开始
- 配置说明
- 构建与镜像
- 代码质量与测试
- 与关联仓库的关系
- 模块说明
- 职责边界
- 参与贡献
- 许可证
- 联系我们
- 致谢

## 项目简介

平台基础设施管理微前端子应用，提供发号器、字典用途、地区语言与国际化信息管理界面；通过动态资源路由和 qiankun 生命周期接入 g2rain-main-shell

## 平台定位

该仓库位于 g2rain 前端应用层，承担“前端应用模块”的角色。

## 应用角色

该仓库聚焦于 `平台基础设施管理`。

主要流程包括：
- Shell 启动与路由映射注册流程
- 子应用挂载与卸载生命周期流程
- 子应用路由同步流程
- 令牌请求、响应与失效事件流程
- Qiankun 运行时初始化与多实例子应用编排流程

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
| 运行时 | Node.js、npm |
| 前端框架 | vue、vue-router、pinia、vue-i18n、element-plus |
| 构建与类型 | vite、typescript、vue-tsc |
| 微前端 | qiankun、vite-plugin-qiankun |
| 接口与模拟 | axios、mockjs、vite-plugin-mock |
| 部署 | Docker、Nginx |

## 环境要求

- Node.js >=22
- npm
- Docker

## 快速开始

| 步骤 | 命令或位置 | 说明 |
| --- | --- | --- |
| 安装依赖 | `npm install` | 根据 package.json 安装前端依赖。 |
| 本地开发 | `npm run dev` | 启动本地开发服务。 |
| 构建产物 | `npm run build` | 执行类型检查与前端构建，生成可发布产物。 |
| 预览产物 | `npm run preview` | 在本地预览构建后的前端产物。 |
| 容器化 | `docker build .` | 仓库提供 Dockerfile，可按组织镜像规范封装前端运行镜像。 |

版本号以项目构建配置为准，当前识别为 `0.1.0`。

## 配置说明

### 运行配置

| 配置项 | 说明 |
| --- | --- |
| `VITE_*` | 前端运行时环境变量，通常由 Vite 与部署环境共同注入。 |

### 路由配置

| 配置项 | 说明 |
| --- | --- |
| `Context Path` | 用于控制前端应用在平台或子路径下的访问基准路径。 |

### 部署配置

| 配置项 | 说明 |
| --- | --- |
| `nginx/default.conf.template` | 容器运行时 Nginx 配置模板，用于静态资源访问和请求转发。 |

## 构建与镜像

| 目标 | 命令 | 产物 | 说明 |
| --- | --- | --- | --- |
| 本地开发 | `npm run dev` | 本地开发服务 | 启动前端本地开发服务。 |
| 前端产物 | `npm run build` | `dist` | 执行类型检查与 Vite/TypeScript 构建，生成可发布产物。 |
| 产物预览 | `npm run preview` | 本地预览服务 | 在本地预览构建后的前端静态产物。 |
| 容器镜像 | `docker build .` | 前端运行镜像 | 基于 Dockerfile 封装静态前端运行镜像。 |
| 构建脚本 | `./build.sh` | 脚本定义的构建结果 | 执行仓库提供的构建脚本，承载组织内镜像或发布流程。 |

## 代码质量与测试

| 检查项 | 命令 | 说明 |
| --- | --- | --- |
| Vue 类型检查 | `npm run build` | 构建流程中使用 vue-tsc 检查 Vue 与 TypeScript 类型。 |

## 与关联仓库的关系

本仓库作为平台基础前端子应用，由 g2rain-main-shell 统一装载，并通过网关调用对应平台后端服务完成管理操作。

## 模块说明

| 模块 | 职责说明 | 代码线索 |
| --- | --- | --- |
| 基础设施配置页面 | 提供发号器、字典用途、地区语言和国际化消息管理。 | src/views/g2rain_raindrop、dictionary_usage、locale_setting、i18n_message |
| 动态路由与资源启动 | 根据平台资源定义加载页面路由并初始化应用。 | src/runtime/boot、src/runtime/router、src/views/route-map.ts |
| 平台运行时 | 承接微前端生命周期、认证态、HTTP 与国际化能力。 | src/platform、src/runtime、src/components |

## 职责边界

该仓库主要负责：
- 负责前端交互与应用流程
- 负责 Shell 层布局、路由入口与子应用编排
- 负责 Shell 到子应用之间的令牌与路由同步事件协调

该仓库默认不负责：
- 不负责子应用内部的具体业务逻辑
- 不替代后端认证或平台服务职责
- 不负责后端服务逻辑

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

本项目基于 [Apache 2.0许可证](https://github.com/g2rain/g2rain-common/blob/main/LICENSE) 开源。

## 联系我们

- Issues: [GitHub Issues](https://github.com/g2rain/g2rain/issues)
- 讨论: [GitHub Discussions](https://github.com/g2rain/g2rain/discussions)
- 邮箱: g2rain_developer@163.com

## 致谢

感谢所有为 g2rain 项目提交 Issue、代码、文档、建议和使用反馈的开发者们！
