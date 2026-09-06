# 本地开发

## 前置条件

- Node.js 22 或更高版本。
- npm，并使用仓库中的 `package-lock.json`。
- 可访问 IAM、Basis、Gateway 和 Infra 服务，或显式开启开发 Mock。

## 安装与启动

```bash
npm ci --legacy-peer-deps
npm run dev
```

默认 `.env` 使用应用编码 `g2rain-infra-app`、Context Path `/infra` 和开发端口 3000。公开的 `VITE_*` 配置会进入浏览器，不能放置 Secret。

独立诊断可访问带 `mode=alone` 的地址；默认空模式表达集成意图，若未被 qiankun 挂载，会跳转 main-shell 网关。

## 提交前验证

```bash
npm run build
```

路由或静态权限变化还应执行 `npm run build:config` 并 Review JSON Diff。代码生成器会覆盖文件，不要直接对含未提交手写改动的页面运行。

