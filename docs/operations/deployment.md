# 部署

## 静态构建

```bash
npm ci --legacy-peer-deps
npm run build
```

产物输出到 `dist`。

## 容器镜像

```bash
docker build --build-arg VITE_BUILD_MODE=production \
  -t g2rain/g2rain-infra-app:<tag> .
```

也可使用仓库脚本：

```bash
./build.sh --image g2rain/g2rain-infra-app --tag <tag> --build-mode production
```

镜像使用 Node 22 构建，并由 OpenResty 提供静态资源、Gateway/IAM 反向代理和 Lua 签名端点。上线前必须验证：

- 构建和容器 `CONTEXT_PATH` 一致；
- main-shell 的 entry/activeRule 与 `/infra` 匹配；
- `SERVER_PORT` 与容器端口映射一致；
- Gateway/IAM 地址可达；
- IAM Key ID、公钥和签名所需私钥由受控 Volume/Secret 挂载；
- `env-config.js` 的缓存、加载顺序和 CSP 策略；
- 独立、集成、直链与回滚流程。

