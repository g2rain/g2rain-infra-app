# 构建与部署

## 本地前端构建

要求 Node.js 22+ 和 npm。该检查只生成并检查浏览器静态产物，不构建容器，也不推送镜像。

```bash
npm ci --legacy-peer-deps
npm run build
```

产物位于 `dist/`。当前没有 `test` 或 `lint` script；`npm run build` 覆盖 `vue-tsc` 与 Vite 生产构建，不代表浏览器、认证、qiankun 或部署验收。

## 容器构建

根目录 `Dockerfile` 使用 Node 22 构建阶段执行同一 `npm run build`，最终镜像基于 `openresty/openresty:alpine`，入口为 `/docker-entrypoint.sh`，声明端口 `8080`（运行时 `SERVER_PORT` 默认 `80`，端口映射需显式核对）。本地脚本和 CI 都传入 `VITE_BUILD_MODE=production`、`IMAGE_VERSION` 与 `VCS_REF`：

```bash
./build.sh --tag 1.0.0 --build-mode production
# 等价：docker build --build-arg VITE_BUILD_MODE=production \
#   --build-arg IMAGE_VERSION=1.0.0 --build-arg VCS_REF=<commit-sha> \
#   -t ghcr.io/g2rain/g2rain-infra-app:1.0.0 .
```

最终镜像包含 `dist/`、OpenResty 配置模板、启动脚本，以及 `lua/config.lua`、`lua/sign.lua`、`lua/sign_api.lua` 和离线构建的 luaossl；不复制 `lua/keys/`。`.dockerignore` 只是限制构建上下文，不能替代 Git 中敏感文件治理。

## GitHub Container Registry（GHCR）发布

镜像地址为 `ghcr.io/g2rain/g2rain-infra-app:<tag>`。工作流位于 `.github/workflows/image.yml`，仅在推送 tag 时触发，并在工作流中严格拒绝不符合 `^v[0-9]+\.[0-9]+\.[0-9]+$` 的 tag；普通分支推送、Pull Request 和手动触发均不会发布。它还验证：

- tag 指向的提交已在 `origin/main` 历史中；
- tag 提交内有非空的 `docs/releases/v<版本>.md`；
- tag 的版本与 `package.json` 的版本一致；
- 使用 Node 22、`npm ci --legacy-peer-deps` 与 `npm run build`。本仓没有独立测试脚本，故没有额外的自动化测试步骤。

工作流仅声明 `contents: read` 和 `packages: write`，通过 GitHub 自动提供的 `GITHUB_TOKEN` 登录 GHCR。成功后才依次推送 `1.0.0` 和 `sha-<完整提交 SHA>` 两个标签；只有两次推送都成功，Actions Summary 才会报告完整镜像地址。它不会创建 GitHub Release、部署服务或更新 `latest`。

现有流程为 `feature/* → develop → main`。将版本、Dockerfile、工作流和 `docs/releases/v1.0.0.md` 经该流程合入并验证 `main` 后，再在该提交执行：

```bash
git tag v1.0.0
git push origin v1.0.0
```

这份仓库内容只准备上述流程；创建 tag、推送代码或镜像、创建 Release 与部署均须由维护者另行执行。

### 匿名拉取与 GHCR 权限

首次成功推送后，如需匿名拉取，在 GitHub Packages 的包页面进入 **Package settings → Change visibility → Public**，将包设为公开。若组织管理员禁止修改，请联系管理员。已有 GHCR 包还可能需要在 **Package settings → Actions access** 中授予 `g2rain-infra-app` Actions 写权限；遇到 `denied` 时，应先检查该设置与组织 Packages 策略，不能只凭 `packages: write` 判断权限足够。

公开包可被任何人拉取：

```bash
docker pull ghcr.io/g2rain/g2rain-infra-app:1.0.0
```

## 运行和实际部署验证

在部署环境将生产密钥作为只读 Secret/Volume 注入 `/usr/local/openresty/nginx/lua/keys/`；不得写进镜像、环境公开配置或仓库。必须验证构建与容器的 `CONTEXT_PATH` 一致、main-shell `entry`/`activeRule` 与 `/infra` 匹配、端口映射、Gateway/IAM 连通性、`env-config.js` 的缓存与 CSP，以及独立、集成、直链与回滚流程。在线演示、匿名拉取、容器构建和实际部署验证是彼此独立的结果，不能相互替代。

