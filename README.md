# g2rain-infra-app

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

基于 Vue 3 + TypeScript + Vite + Element Plus + qiankun 的微前端子应用，支持作为子应用被主应用加载，或独立运行。

**生态**：主壳 [g2rain-main-shell](https://github.com/g2rain/g2rain-main-shell)；通用子应用官方模板 [g2rain-app-template](https://github.com/g2rain/g2rain-app-template) 与脚手架 [create-g2rain-app](https://github.com/g2rain/g2rain-app-cli)。**本仓库**侧重 G2rain **基建 / 平台能力**方向的 qiankun 子应用实现，与通用模板并存，可按需选用。

## 📋 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [核心特性](#核心特性)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [qiankun 集成](#qiankun-集成)
- [路由配置](#路由配置)
- [Vite 配置](#vite-配置)
- [Dockerfile 镜像生成](#dockerfile-镜像生成)
- [构建与部署](#构建与部署)
- [常见问题](#常见问题)
- [项目结构](#-项目结构)
- [代码规范](#-代码规范)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [联系我们](#-联系我们)
- [致谢](#-致谢)

## 🎯 项目简介

g2rain-infra-app 提供以下核心能力：

- **qiankun 子应用支持**：支持作为子应用被主应用加载，或独立运行
- **Token 管理**：从主应用接收 token，自动初始化 token store
- **子应用隔离**：子应用环境下自动禁用 token 持久化，避免与主应用冲突
- **SSO/DPoP Token 管理**：支持 SSO 单点登录和 DPoP 协议
- **安全签名**：使用 ES256 算法进行请求签名，确保 API 安全

## 🛠 技术栈

### 前端技术栈

- **框架**：Vue 3.3.4 + TypeScript 5.4.5
- **构建工具**：Vite 5.0.0
- **微前端**：qiankun 2.10.14
- **UI 组件库**：Element Plus 2.4.3
- **状态管理**：Pinia 2.1.7 + pinia-plugin-persistedstate 3.2.1
- **路由**：Vue Router 4.2.5
- **HTTP 客户端**：Axios 1.12.2
- **加密库**：jose 6.1.0、crypto-js 4.2.0、elliptic 6.6.1

### 后端技术栈（可选）

- **Web 服务器**：OpenResty (Nginx + Lua)
- **Lua 库**：lua-resty-openssl（ES256 签名支持）
- **签名算法**：ES256 (ECDSA P-256 + SHA-256)

---

## ✨ 核心特性

### 1. 双模式运行

项目支持两种运行模式：

1. **独立运行模式**：
   - 直接访问子应用 URL
   - Token 会持久化到 localStorage
   - 支持完整的 SSO 登录流程

2. **子应用模式**：
   - 被主应用通过 qiankun 加载
   - Token 由主应用通过 props 传递
   - 自动禁用 token 持久化，避免与主应用冲突

系统会自动检测 `window.__POWERED_BY_QIANKUN__` 来判断运行模式。

### 2. Token 管理

**代码位置**：`src/store/modules/token.ts`

- **子应用模式**：从主应用接收 token，不持久化
- **独立运行模式**：正常持久化到 localStorage
- 自动验证 token 有效性
- 支持 token 自动刷新

### 3. qiankun 生命周期

**代码位置**：`src/main.ts`、`src/qiankun.ts`

```typescript
// 导出 qiankun 生命周期函数
export async function bootstrap() { ... }
export async function mount(props: QiankunProps) { ... }
export async function unmount() { ... }
export async function update(props: QiankunProps) { ... }
```

在 `mount` 生命周期中自动接收主应用传递的 token 并初始化。

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9
- Docker（可选，用于部署）

### 安装依赖

```bash
npm install
```

### 本地开发

1. **创建 `.env` 文件**：

```env
# 应用编码（必填）
VITE_APPLICATION_CODE=g2rain-infra-app

# 前端基础路径（根据主应用分配的路径修改）
VITE_BASE_URL=/test/

# 后端网关地址（必填）
VITE_BACKEND_ORIGIN=http://localhost:8080

# 应用上下文路径（nginx 分配的路径，如 /test）
VITE_APPLICATION_CONTEXT=/test

# IAM/认证服务地址（默认等于 VITE_BACKEND_ORIGIN）
VITE_IAM_ORIGIN=http://localhost:8080

# Token 相关接口（必填）
VITE_REFRESH_TOKEN_URL=/auth/refresh-token
VITE_GENERATE_TOKEN_URL=/auth/token

# SSO 配置（必填）
VITE_SSO_BASE_URL=https://sso.example.com
VITE_AUTH_END_POINT=/auth/authorize
VITE_REDIRECT_URI=http://localhost:3000/test/sso_callback

# 开发服务器端口（可选）
VITE_SERVER_PORT=3000
```

> **⚠️ 重要提示**：
> - `VITE_BASE_URL` 和 `VITE_REDIRECT_URI` 中的 `/test/` 是示例路径，请根据主应用分配的实际路径修改
> - `VITE_APPLICATION_CONTEXT` 需要与 nginx 配置中的应用路径一致
> - 创建项目后请务必修改这些路径配置，避免 SSO 回调或资源路径错误

2. **启动开发服务器**：

```bash
npm run dev
```

3. **访问应用**：

- 独立运行：打开浏览器访问 `http://localhost:3000`
- 子应用模式：由主应用加载，无需直接访问

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### TypeScript 输出约束

- 项目已启用 `tsconfig.json` 中的 `noEmit: true`。
- 本地开发和构建过程中，TypeScript 不应在 `src/` 目录生成 `.js` / `.js.map` 文件。
- 若历史文件已存在，可在项目根目录执行清理：

```bash
Get-ChildItem -Path .\src -Recurse -File -Include *.js,*.js.map | Remove-Item -Force
```

### 预览构建产物

```bash
npm run preview
```

---

## ⚙️ 环境配置

### 环境变量说明

| 变量名 | 说明 | 示例 | 必填 |
|--------|------|------|------|
| `VITE_APPLICATION_CODE` | 应用编码 | `g2rain-infra-app` | ✅ |
| `VITE_BASE_URL` | 前端应用基础路径 | `/test/` 或 `/` | ❌ |
| `VITE_BACKEND_ORIGIN` | 后端网关地址 | `http://localhost:8080` | ✅ |
| `VITE_APPLICATION_CONTEXT` | 应用上下文路径（nginx） | `/test` 或 `/` | ❌ |
| `VITE_IAM_ORIGIN` | IAM/认证服务地址 | `http://localhost:8080` | ❌ |
| `VITE_REFRESH_TOKEN_URL` | Token 刷新接口路径 | `/auth/refresh-token` | ✅ |
| `VITE_GENERATE_TOKEN_URL` | Token 生成接口路径 | `/auth/token` | ✅ |
| `VITE_SSO_BASE_URL` | SSO 服务基础地址 | `https://sso.example.com` | ✅ |
| `VITE_AUTH_END_POINT` | SSO 认证端点 | `/auth/authorize` | ✅ |
| `VITE_REDIRECT_URI` | SSO 回调地址 | `http://localhost:3000/test/sso_callback` | ✅ |
| `VITE_SERVER_PORT` | 开发服务器端口 | `3000` | ❌ |

### 本地开发配置

本地开发时，环境变量通过 `.env` 文件配置，Vite 会自动读取并注入到 `import.meta.env`。

**代码位置**：`src/utils/env.ts`

```typescript
export const env = {
  VITE_APPLICATION_CODE: getEnvVar('VITE_APPLICATION_CODE', 'g2rain-app'),
  VITE_BASE_URL: getEnvVar('VITE_BASE_URL', '/'),
  VITE_BACKEND_ORIGIN: getEnvVar('VITE_BACKEND_ORIGIN', 'http://localhost:8080'),
  VITE_APPLICATION_CONTEXT: getEnvVar('VITE_APPLICATION_CONTEXT', '/'),
  // ... 其他环境变量
};
```

### Docker 部署配置

Docker 部署时，环境变量需要在构建阶段通过 `--build-arg` 传入，Vite 会在构建时将环境变量打包到代码中。运行时环境变量已经内置在构建产物中，无需额外配置。

---

## 🔗 qiankun 集成

### 1. 主应用配置

主应用在加载子应用时，需要传递以下 props：

```typescript
loadMicroApp({
  name: 'g2rain-infra-app',
  entry: '//localhost:3000',  // 或生产环境地址
  container: '#container',
  props: {
    token: 'your-token-string',    // 必填：token 字符串
    tokenKid: 'your-token-kid'     // 必填：token 的 kid (key id)
  }
})
```

### 2. 子应用接收 Token

**代码位置**：`src/qiankun.ts`

子应用在 `mount` 生命周期中自动接收并初始化 token：

```typescript
export async function mount(props: QiankunProps) {
  console.log('[qiankun] 子应用挂载', props);
  
  // 初始化 token store（从主应用传递的 props 中获取 token）
  await initTokenFromProps(props);
  
  // 渲染 Vue 应用
  render(props.container);
}
```

### 3. Token Store 配置

**代码位置**：`src/store/modules/token.ts`

子应用环境下自动禁用 token 持久化：

```typescript
persist: (window as any).__POWERED_BY_QIANKUN__
  ? false // 子应用不进行 token 持久化
  : {
      key: STORAGE_KEY,
      storage: localStorage,
      paths: ['client', 'token', 'tokenString', 'logged'],
    },
```

### 4. Props 接口定义

**代码位置**：`src/qiankun.ts`

```typescript
export interface QiankunProps {
  container?: HTMLElement;
  token?: string;      // token 字符串
  tokenKid?: string;  // token 的 kid (key id)
  [key: string]: any;  // 允许其他自定义参数
}
```

---

## 🛣️ 路由配置

### 1. 路由定义

**代码位置**：`src/router/index.ts`

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页', requiresAuth: true }
  },
  {
    path: '/sso_callback',
    name: 'SsoCallback',
    component: () => import('@/views/SsoCallback.vue'),
    meta: { title: 'SSO回调', requiresAuth: false }
  },
  // ... 其他路由
];
```

### 2. 路由初始化

```typescript
const createAppRouter = () => {
  return createRouter({
    history: createWebHistory(env.VITE_BASE_URL),
    routes
  });
};
```

### 3. 基础路径配置

路由使用 `createWebHistory(env.VITE_BASE_URL)` 创建，支持配置基础路径：

- 开发环境：`/`（默认）或 `/test/`（根据配置）
- 生产环境：根据 `VITE_BASE_URL` 配置（如 `/test/`）

---

## ⚙️ Vite 配置

### 1. 本地开发环境配置

**代码位置**：`vite.config.ts`

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const base = env.VITE_BASE_URL || '/';
  const backendOrigin = env.VITE_BACKEND_ORIGIN || 'http://localhost:8080';
  const backendContext = env.VITE_APPLICATION_CONTEXT || '';
  const iamOrigin = env.VITE_IAM_ORIGIN || backendOrigin;
  
  const backendWithContext = trimSlashEnd(backendOrigin) + ensureLeadingSlash(trimSlashEnd(backendContext));
  
  return {
    base,
    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.VITE_SERVER_PORT || '3000', 10),
      open: true,
      cors: true,
      proxy: {
        '/keys/iam-public-key': {
          target: backendWithContext,
          changeOrigin: true,
        },
        '/keys/iam-key-id': {
          target: backendWithContext,
          changeOrigin: true,
        },
        '/lua/sign_code': {
          target: backendWithContext,
          changeOrigin: true,
        },
        '/auth/': {
          target: iamOrigin,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/auth/, '/auth'),
        },
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
        },
      },
    },
    // ... 其他配置
  };
});
```

### 2. 生产环境配置

生产环境通过环境变量 `VITE_BASE_URL` 配置基础路径：

```bash
# 例如：部署在 /test 路径下
VITE_BASE_URL=/test/ npm run build
```

### 3. 环境变量注入

**本地开发**：
- 使用 `.env` 文件配置
- Vite 自动读取并注入到 `import.meta.env`

**生产环境（Docker）**：
- 环境变量在构建时通过 Vite 的 `loadEnv` 注入到代码中
- 构建时使用 `--mode` 参数指定环境模式（如 `production`）
- 所有环境变量在构建时被打包到代码中，运行时直接使用 `import.meta.env` 访问

---

## 🐳 Dockerfile 镜像生成

### 1. 多阶段构建

**代码位置**：`Dockerfile`

#### 阶段 1：前端构建

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# 使用国内镜像加速
RUN npm config set registry https://registry.npmmirror.com/

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install --legacy-peer-deps

# 复制项目文件
COPY . .

# 设置构建模式和环境变量
ARG VITE_BUILD_MODE=production
ENV VITE_BUILD_MODE=$VITE_BUILD_MODE

# 执行构建
RUN npx vite build --mode $VITE_BUILD_MODE
```

#### 阶段 2：OpenResty 运行时

```dockerfile
FROM openresty/openresty:alpine

# 安装构建依赖
RUN apk add --no-cache \
    curl git perl gettext ca-certificates openssl openssl-dev \
    build-base bash unzip pkgconfig lua5.1-dev lua5.1 \
    luarocks

# 设置 Lua 路径
ENV LUA_PATH="/usr/local/openresty/site/lualib/?.lua;/usr/local/openresty/site/lualib/?/init.lua;;"
ENV LUA_CPATH="/usr/local/openresty/site/lualib/?.so;;"

# 安装 luaossl（离线安装）
COPY lua/luaossl-rel-20250929.tar.gz /tmp/
RUN tar -xzf /tmp/luaossl-rel-20250929.tar.gz -C /tmp/luaossl-src && \
    cd /tmp/luaossl-src/luaossl-rel-20250929 && \
    make install5.1 LUA51PATH=/usr/local/openresty/site/lualib && \
    make install5.2 LUA52PATH=/usr/local/openresty/site/lualib

# 复制构建产物和配置文件
COPY --from=builder /app/dist /usr/local/openresty/nginx/html
COPY lua/ /usr/local/openresty/nginx/lua/
COPY nginx/default.conf.template /etc/nginx/conf.d/
COPY nginx/docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# 暴露端口
EXPOSE 8080

# 启动命令
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

### 2. 构建命令

```bash
# 基础构建
docker build -t g2rain-infra-app .

# 指定构建模式和环境变量
docker build \
  --build-arg VITE_BUILD_MODE=production \
  --build-arg VITE_BASE_URL=/test/ \
  --build-arg VITE_APPLICATION_CODE=g2rain-infra-app \
  --build-arg VITE_BACKEND_ORIGIN=https://api.example.com \
  --build-arg VITE_APPLICATION_CONTEXT=/test \
  -t g2rain-infra-app .
```

**注意**：环境变量需要在构建时通过 `--build-arg` 传入，Vite 会在构建时将环境变量打包到代码中。运行容器的详细说明请参考 [构建与部署](#构建与部署) 部分。

---

## 🐳 构建与部署

### 1. 运行容器

构建镜像后，使用以下命令运行容器：

```bash
docker run -d \
  -p 8080:8080 \
  -e BASE_URL=/test \
  -e GATEWAY_HOST=gateway.example.com \
  -e GATEWAY_PORT=8080 \
  -e IAM_HOST=iam.example.com \
  -e IAM_PORT=8080 \
  -e SERVER_PORT=8080 \
  -v ./lua/keys:/usr/local/openresty/nginx/lua/keys:ro \
  g2rain-infra-app
```

**环境变量说明**：
- `BASE_URL`: 应用基础路径（如 `/test`）
- `GATEWAY_HOST`: API 网关主机地址
- `GATEWAY_PORT`: API 网关端口
- `IAM_HOST`: IAM 服务主机地址
- `IAM_PORT`: IAM 服务端口
- `SERVER_PORT`: Nginx 监听端口（默认 8080）

**注意**：前端相关的环境变量（如 `VITE_BASE_URL`、`VITE_SSO_BASE_URL` 等）需要在构建时通过 `--build-arg` 传入，运行时无需再设置。

### 2. Docker Compose

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'
services:
  web:
    build:
      context: .
      args:
        # 前端环境变量（构建时传入）
        - VITE_BUILD_MODE=production
        - VITE_APPLICATION_CODE=g2rain-infra-app
        - VITE_BASE_URL=/test/
        - VITE_BACKEND_ORIGIN=https://api.example.com
        - VITE_APPLICATION_CONTEXT=/test
        - VITE_SSO_BASE_URL=https://sso.example.com
        - VITE_REDIRECT_URI=https://your-domain.com/test/sso_callback
    ports:
      - "8080:8080"
    environment:
      # 运行时环境变量（Nginx 配置使用）
      - BASE_URL=/test
      - GATEWAY_HOST=gateway.example.com
      - GATEWAY_PORT=8080
      - IAM_HOST=iam.example.com
      - IAM_PORT=8080
      - SERVER_PORT=8080
    volumes:
      - ./lua/keys:/usr/local/openresty/nginx/lua/keys:ro
```

运行：

```bash
docker-compose up -d
```

### 3. 密钥文件配置（可选）

如果使用 Lua 签名功能，需要配置密钥文件：

1. **生成密钥对（DER 格式）**：

```bash
cd lua/keys

# 生成私钥（PEM 格式）
openssl ecparam -genkey -name prime256v1 -noout -out private-key.pem

# 转换为 DER 格式
openssl ec -in private-key.pem -outform DER -out private-key.der

# 生成公钥（PEM 格式）
openssl ec -in private-key.pem -pubout -out public-key.pem

# 转换为 DER 格式
openssl ec -in public-key.pem -pubout -outform DER -out public-key.der

# 生成 keyId（可选，或手动创建）
echo "yEMzeGLlhMpK5GxQKP5Fhg7JH9eALB7BK2BkadTOUxw" > iam-key-id.txt
```

2. **设置文件权限**：

```bash
chmod 600 lua/keys/private-key.der
chmod 644 lua/keys/public-key.der
chmod 644 lua/keys/iam-key-id.txt
```

3. **确保密钥文件不被提交到版本控制系统**（已在 `.gitignore` 中配置）

---

## 🐛 常见问题

### 1. 子应用加载失败

检查：
- 子应用是否已启动
- 主应用中的 `entry` 配置是否正确
- 子应用是否按照 qiankun 规范配置了生命周期函数
- 检查浏览器控制台是否有错误信息

### 2. Token 未正确接收

检查：
- 主应用是否正确传递了 `token` 和 `tokenKid` props
- 子应用的 `mount` 生命周期是否正常执行
- 检查浏览器控制台是否有 token 初始化相关的日志

### 3. 路径配置错误

检查：
- `VITE_BASE_URL` 是否与主应用分配的路径一致
- `VITE_REDIRECT_URI` 是否包含正确的基础路径
- `VITE_APPLICATION_CONTEXT` 是否与 nginx 配置一致
- 生产环境构建时是否正确传入了环境变量

### 4. Token 持久化问题

检查：
- 子应用模式下，token 不应该持久化（这是正常行为）
- 独立运行模式下，token 应该正常持久化到 localStorage
- 检查 `window.__POWERED_BY_QIANKUN__` 是否正确检测

### 5. SSO 回调失败

检查：
- `VITE_REDIRECT_URI` 配置是否正确
- SSO 服务配置的回调地址是否与 `VITE_REDIRECT_URI` 一致
- 路由配置是否正确（`/sso_callback` 路由是否存在）

### 6. 路由 404 错误

检查：
- `VITE_BASE_URL` 配置是否正确
- Nginx 配置中的 `try_files` 是否正确
- 生产环境是否配置了正确的 `BASE_URL`

### 7. DPoP 签名验证失败

检查：
- 客户端密钥对是否正确生成
- 服务器端公钥配置是否正确
- 时间同步是否正常

---

## 📝 项目结构

```
g2rain-infra-app/
├── src/
│   ├── App.vue              # 根组件
│   ├── main.ts              # 入口文件（包含 qiankun 生命周期）
│   ├── qiankun.ts           # qiankun 配置和 token 初始化
│   ├── router/              # 路由配置
│   │   └── index.ts         # 路由定义和初始化
│   ├── store/               # Pinia 状态管理
│   │   ├── index.ts         # Store 初始化
│   │   └── modules/
│   │       └── token.ts     # Token store（子应用不持久化）
│   ├── types/               # TypeScript 类型定义
│   │   ├── env.d.ts         # 环境变量类型
│   │   ├── http.ts          # HTTP 相关类型
│   │   └── menu.ts          # 菜单相关类型
│   ├── utils/               # 工具函数
│   │   ├── env.ts           # 环境变量工具
│   │   ├── http.ts          # HTTP 请求工具（包含 DPoP 签名）
│   │   ├── sign.ts          # 签名工具
│   │   └── sso.ts           # SSO 工具
│   └── views/               # 页面组件
│       ├── Home.vue          # 首页
│       ├── SsoCallback.vue   # SSO 回调页面
│       └── system/           # 系统管理模块示例
│           ├── User.vue      # 用户管理
│           └── Role.vue      # 角色管理
├── lua/                     # OpenResty Lua 签名示例（可选）
│   ├── config.lua           # 密钥配置
│   ├── sign.lua             # 签名实现
│   └── sign_api.lua         # 签名接口
├── nginx/                   # Nginx 配置示例（可选）
│   ├── default.conf.template # Nginx 配置模板
│   └── docker-entrypoint.sh # 启动脚本
├── Dockerfile               # Docker 构建文件
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖配置
```

---

## 📝 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 规范
- 使用 ESLint 进行代码检查（如已配置）
- 组件和工具函数按功能模块组织

## 🤝 贡献指南

我们欢迎所有形式的贡献！

**Issue 与讨论**请统一到主仓库 [g2rain/g2rain](https://github.com/g2rain/g2rain/issues) 提交，便于集中跟踪；请在标题或正文中注明与 **g2rain-infra-app** 相关。

### 贡献流程

1. **Fork** 本仓库
2. **创建特性分支**：`git checkout -b feature/your-feature-name`
3. 本地修改后执行 `npm run build`，确保可正常编译
4. **提交更改**：`git commit -m "Add some feature"`
5. **推送分支**：`git push origin feature/your-feature-name`
6. **提交 Pull Request**

维护者信息与 `package.json` 中 `contributors` 字段一致（与 [g2rain-spring-boot-starter](https://github.com/g2rain/g2rain-spring-boot-starter) 开发者信息对齐）。

安全相关问题请见 [SECURITY.md](SECURITY.md)。

## 📄 许可证

本项目基于 [Apache 2.0许可证](LICENSE) 开源。

## 📞 联系我们

- **Issues**: [GitHub Issues](https://github.com/g2rain/g2rain/issues)
- **讨论**: [GitHub Discussions](https://github.com/g2rain/g2rain/discussions)
- **邮箱**: g2rain_developer@163.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者们！

---

⭐ 如果这个项目对您有帮助，请给我们一个Star！

---

**注意**：
- 使用前请确保已正确配置环境变量，特别是路径相关的配置
- 子应用模式下，token 由主应用管理，无需配置 SSO 相关环境变量
- 独立运行模式下，需要完整配置 SSO 相关环境变量
