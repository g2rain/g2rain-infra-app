# Git 工作流

- 从团队约定的开发分支创建 `feature/<name>` 或 `fix/<name>`。
- 提交信息建议使用 `type(scope): summary`，例如 `docs(readme): document infra app workflows`。
- 页面生成与资源生成结果应单独核对，PR 中记录实际命令和覆盖范围。
- 提交前执行 `npm run build`，并说明浏览器、qiankun、IAM/Gateway/Infra 或容器验证情况。
- 不提交 `node_modules`、`dist`、IDE 状态、私钥、Token、生产 Secret 或真实业务数据。
- 架构偏差和未验证项必须在 PR 中可见，不能用“构建通过”代替功能验收。
- 发布改动遵循 `feature/* → develop → main`：版本、工作流和 `docs/releases/v<版本>.md` 必须先进入 `main`，然后才可在已验证的 `main` 提交创建稳定版标签。发布工作流不创建 GitHub Release、不部署服务，也不更新 `latest`。

