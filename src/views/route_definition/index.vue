<template>
  <div class="route_definition-page">
    <!-- 查询表单 -->
    <el-card class="route_definition-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm
        ref="queryFormRef"
        v-model="baseQueryForm"
        @search="handleSearch"
      >
        <!-- 业务特定查询字段 -->
        <el-form-item label="名称">
          <el-input v-model="queryForm.name" placeholder="请输入名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="服务地址">
          <el-input v-model="queryForm.endpointHost" placeholder="请输入服务地址" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="业务路径">
          <el-input v-model="queryForm.endpointPath" placeholder="请输入业务路径" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="服务路径">
          <el-input v-model="queryForm.context" placeholder="请输入服务路径" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="queryForm.path" placeholder="请输入路径" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="方法">
          <el-input v-model="queryForm.method" placeholder="请输入方法" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="请求头参数">
          <el-input v-model="queryForm.headerParameters" placeholder="请输入请求头参数" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="请求格式">
          <el-input v-model="queryForm.contentType" placeholder="请输入请求格式" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="queryForm.description" placeholder="请输入描述" clearable style="width: 200px" />
        </el-form-item>

        <!-- 操作按钮 -->
        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <!-- 标题和操作按钮 -->
    <div class="route_definition-page__header">
      <div class="route_definition-page__title-group">
        <h2>管理各类route_definition数据</h2>
      </div>
      <el-button type="primary" v-permission="'route_definition:add'" @click="handleCreate">新增route_definition</el-button>
    </div>

    <SortableTable
      :data="tableData"
      border
      stripe
      style="width: 100%"
      :enable-multi-sort="true"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="endpointHost" label="服务地址" width="180" />
      <el-table-column prop="context" label="服务路径" width="80" />
      <el-table-column prop="path" label="路径" width="120" />
      <el-table-column prop="endpointPath" label="业务路径" width="180" />
      <el-table-column prop="method" label="方法" width="60" />
      <el-table-column prop="headerParameters" label="请求头参数" width="180" />
      <el-table-column prop="contentType" label="请求格式" width="180" />
      <el-table-column prop="description" label="描述" width="180" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="180">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">明细</el-button>
          <el-button type="primary" v-permission="'route_definition:edit'" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" v-permission="'route_definition:delete'" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>操作</span>
            <SortManagerButton />
          </div>
        </template>
      </el-table-column>
    </SortableTable>

    <!-- 分页组件 -->
    <div class="route_definition-page__pagination">
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑route_definition' : '新增route_definition'"
      width="520px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="服务地址" prop="endpointHost">
          <el-input v-model="editForm.endpointHost" placeholder="请输入服务地址" />
        </el-form-item>
        <el-form-item label="服务路径" prop="context">
          <el-input v-model="editForm.context" placeholder="请输入服务路径" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="editForm.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="业务路径" prop="endpointPath">
          <el-input v-model="editForm.endpointPath" placeholder="请输入业务路径" />
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-select v-model="editForm.method" placeholder="请选择方法" style="width: 100%">
            <el-option label="GET" value="GET" />
            <el-option label="PUT" value="PUT" />
            <el-option label="POST" value="POST" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="请求头参数" prop="headerParameters">
          <el-input v-model="editForm.headerParameters" placeholder="请输入请求头参数" />
        </el-form-item>
        <el-form-item label="请求格式" prop="contentType">
          <el-input v-model="editForm.contentType" placeholder="请输入请求格式" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 明细弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="route_definition明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">
          {{ currentRow?.name }}
        </el-descriptions-item>
        <el-descriptions-item label="服务地址">
          {{ currentRow?.endpointHost }}
        </el-descriptions-item>
        <el-descriptions-item label="服务路径">
          {{ currentRow?.context }}
        </el-descriptions-item>
        <el-descriptions-item label="路径">
          {{ currentRow?.path }}
        </el-descriptions-item>
        <el-descriptions-item label="业务路径">
          {{ currentRow?.endpointPath }}
        </el-descriptions-item>
        <el-descriptions-item label="方法">
          {{ ['GET', 'PUT', 'POST', 'DELETE'].includes(String(currentRow?.method || '').toUpperCase()) ? String(currentRow?.method || '').toUpperCase() : '' }}
        </el-descriptions-item>
        <el-descriptions-item label="请求头参数">
          {{ currentRow?.headerParameters }}
        </el-descriptions-item>
        <el-descriptions-item label="请求格式">
          {{ currentRow?.contentType }}
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ currentRow?.description }}
        </el-descriptions-item>
        <el-descriptions-item label="版本号">{{ currentRow?.version }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { RouteDefinitionApi } from './api';
import type { RouteDefinition, RouteDefinitionPayload, RouteDefinitionQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

const tableData = ref<RouteDefinition[]>([]);

// 基础查询表单（BaseSelectListDto）
let baseQueryForm = reactive<BaseSelectListDto>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务特定查询表单
const queryForm = reactive({
  name: '',
  endpointHost: '',
  endpointPath: '',
  context: '',
  path: '',
  method: '',
  headerParameters: '',
  contentType: '',
  description: '',
});

// 组件引用
const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const editDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const isEdit = ref(false);
const currentRow = ref<RouteDefinition | null>(null);

const editFormRef = ref<FormInstance | null>(null);

const editForm = reactive({
  id: 0,
  name: '',
  endpointHost: '',
  endpointPath: '',
  context: '',
  path: '',
  method: '',
  headerParameters: '',
  contentType: '',
  description: '',
});

const editRules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  endpointHost: [{ required: true, message: '请输入服务地址', trigger: 'blur' }],
  endpointPath: [],
  context: [{ required: true, message: '请输入服务路径', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
  method: [{ required: true, message: '请选择方法', trigger: 'change' }],
  headerParameters: [],
  contentType: [],
  description: [],
};

const handleCreate = () => {
  isEdit.value = false;
  editForm.name = '';
  editForm.endpointHost = '';
  editForm.endpointPath = '';
  editForm.context = '';
  editForm.path = '';
  editForm.method = '';
  editForm.headerParameters = '';
  editForm.contentType = '';
  editForm.description = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: RouteDefinition) => {
  isEdit.value = true;
  editForm.id = row.id;
  editForm.name = row.name;
  editForm.endpointHost = row.endpointHost;
  editForm.endpointPath = row.endpointPath;
  editForm.context = row.context;
  editForm.path = row.path;
  editForm.method = row.method;
  editForm.headerParameters = row.headerParameters;
  editForm.contentType = row.contentType;
  editForm.description = row.description;
  editDialogVisible.value = true;
};

const handleView = (row: RouteDefinition) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const handleDelete = (row: RouteDefinition) => {
  ElMessageBox.confirm(`确认删除route_definition「${row.id}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      try {
        await RouteDefinitionApi.remove(row.id);
        // 如果当前页只有一条数据，删除后应该跳转到上一页
        if (tableData.value.length === 1 && pagination.pageNum > 1) {
          pagination.pageNum--;
        }
        await loadData();
        ElMessage.success('删除成功');
      } catch (error: any) {
        showErrorMessage(error || '删除失败');
      }
    })
    .catch(() => {});
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: RouteDefinitionPayload = {
    name: editForm.name,
    endpointHost: editForm.endpointHost,
    endpointPath: editForm.endpointPath,
    context: editForm.context,
    path: editForm.path,
    method: editForm.method,
    headerParameters: editForm.headerParameters,
    contentType: editForm.contentType,
    description: editForm.description,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await RouteDefinitionApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || '保存失败');
  }
};

// 处理排序变化
const handleSortChange = (params: Record<string, string>) => {
  // 更新 QueryForm 的 sorts 字段
  if (queryFormRef.value) {
    queryFormRef.value.updateSorts(params);
  }
};

const loadData = async () => {
  try {
    // 构建查询条件（query 对象），包含基础查询参数和业务查询参数
    const query: RouteDefinitionQuery = {
      // 基础查询参数（BaseSelectListDto）- 使用 Object.fromEntries 过滤无效值
      ...Object.fromEntries(
        Object.entries(baseQueryForm).filter(
          ([_, v]) => v != null && (!Array.isArray(v) || v.length > 0)
        )
      ),
      // 业务查询字段
      ...(queryForm.name ? { name: queryForm.name } : {}),
      ...(queryForm.endpointHost ? { endpointHost: queryForm.endpointHost } : {}),
      ...(queryForm.endpointPath ? { endpointPath: queryForm.endpointPath } : {}),
      ...(queryForm.context ? { context: queryForm.context } : {}),
      ...(queryForm.path ? { path: queryForm.path } : {}),
      ...(queryForm.method ? { method: queryForm.method } : {}),
      ...(queryForm.headerParameters ? { headerParameters: queryForm.headerParameters } : {}),
      ...(queryForm.contentType ? { contentType: queryForm.contentType } : {}),
      ...(queryForm.description ? { description: queryForm.description } : {}),
    };
    
    // 检查 query 对象是否有有效值
    const hasQuery = Object.values(query).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    });
    
    // 构建查询参数，符合 RouteDefinitionQuery & PageSelectListDto 格式
    const params: RouteDefinitionQuery & PageSelectListDto = {
      // 分页参数
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      // 查询条件（直接展开，仅在有效时包含）
      ...(hasQuery ? query : {}),
    };
    
    const pageData = await RouteDefinitionApi.page(params);
    
    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: any) {
    showErrorMessage(error || '加载列表失败');
  }
};

// 查询
const handleSearch = () => {
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 重置查询条件
const handleReset = () => {
  // 重置基础查询表单
  baseQueryForm.id = undefined;
  baseQueryForm.createTime = undefined;
  baseQueryForm.updateTime = undefined;
  baseQueryForm.sorts = undefined;
  
  // 重置业务特定查询表单
  queryForm.name = '';
  queryForm.endpointHost = '';
  queryForm.endpointPath = '';
  queryForm.context = '';
  queryForm.path = '';
  queryForm.method = '';
  queryForm.headerParameters = '';
  queryForm.contentType = '';
  queryForm.description = '';
  
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 页码变化
const handlePageChange = (page: number) => {
  pagination.pageNum = page;
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.route_definition-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.route_definition-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.route_definition-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.route_definition-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.route_definition-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.route_definition-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

