# 页面代码生成

页面生成器读取 `src/shared/generator/database.sql` 中的 MySQL DDL，根据表名生成 views 页面骨架。

## 命令

```bash
npm run build:generate -- --tables=g2rain_raindrop
```

多个表使用逗号分隔，也支持空格参数形式：

```bash
npm run build:generate -- --tables dictionary_usage,dictionary_item
```

默认生成或更新：

- `src/views/<table>/index.vue`
- `src/views/<table>/api.ts`
- `src/views/<table>/type.ts`
- `src/views/<table>/mock.ts`
- `src/views/route-map.ts`

可使用 `--no-view`、`--no-api`、`--no-mock`、`--no-route` 关闭对应阶段。

## 安全流程

1. 确认命令在仓库根目录执行，DDL 中存在目标表。
2. 检查 Git 状态并提交或备份手写改动。
3. 先在临时分支/副本验证命令；生成器以 `writeFileSync` 覆盖同名 view、api、type 和 mock 文件。
4. 人工校正接口语义、Payload、ID、权限、国际化、敏感字段和错误处理。
5. Review `route-map.ts`，再运行资源生成与生产构建。

DDL 中存在表不代表当前后端一定提供对应功能，生成结果也不是领域或架构事实来源。

