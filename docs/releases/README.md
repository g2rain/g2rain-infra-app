# 发布记录

- [v1.0.0：基础设施管理子应用与 GHCR 镜像发布流程](v1.0.0.md)

发布改动遵循 `feature/* → develop → main`。版本、工作流和同名发布说明进入已验证的 `main` 后，推送严格格式的稳定版 `v<major>.<minor>.<patch>` 标签才会触发 GHCR 发布；流程不会创建 GitHub Release、部署服务或更新 `latest`。
