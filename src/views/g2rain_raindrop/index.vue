<template>
  <div class="g2rain_raindrop-page">
    <!-- 查询表单 -->
    <el-card class="g2rain_raindrop-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm
        ref="queryFormRef"
        v-model="baseQueryForm"
        @search="handleSearch"
      >
        <!-- 业务特定查询字段 -->
        <el-form-item label="业务标签">
          <el-input v-model="queryForm.bizTag" placeholder="请输入业务标签" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="最大 ID">
          <el-input v-model="queryForm.maxId" placeholder="请输入最大 ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="步长">
          <el-input v-model="queryForm.step" placeholder="请输入步长" clearable style="width: 200px" />
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
    <div class="g2rain_raindrop-page__header">
      <div class="g2rain_raindrop-page__title-group">
        <h2>管理各类g2rain_raindrop数据</h2>
      </div>
      <el-button type="primary" v-permission="'g2rain_raindrop:add'" @click="handleCreate">新增g2rain_raindrop</el-button>
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
      <el-table-column prop="bizTag" label="业务标签" width="180" />
      <el-table-column prop="maxId" label="最大 ID" width="140" />
      <el-table-column prop="step" label="步长" width="140" />
      <el-table-column prop="description" label="描述" width="180" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">明细</el-button>
          <el-button type="primary" v-permission="'g2rain_raindrop:edit'" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" v-permission="'g2rain_raindrop:delete'" link size="small" @click="handleDelete(row)">删除</el-button>
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
    <div class="g2rain_raindrop-page__pagination">
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
      :title="isEdit ? '编辑g2rain_raindrop' : '新增g2rain_raindrop'"
      width="520px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="业务标签" prop="bizTag">
          <el-input v-model="editForm.bizTag" placeholder="请输入业务标签" />
        </el-form-item>
        <el-form-item label="最大 ID" prop="maxId">
          <el-input v-model="editForm.maxId" placeholder="请输入最大 ID" />
        </el-form-item>
        <el-form-item label="步长" prop="step">
          <el-input v-model="editForm.step" placeholder="请输入步长" />
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
    <el-dialog v-model="detailDialogVisible" title="g2rain_raindrop明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="业务标签">
          {{ currentRow?.bizTag }}
        </el-descriptions-item>
        <el-descriptions-item label="最大 ID">
          {{ currentRow?.maxId }}
        </el-descriptions-item>
        <el-descriptions-item label="步长">
          {{ currentRow?.step }}
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
import { G2rainRaindropApi } from './api';
import type { G2rainRaindrop, G2rainRaindropPayload, G2rainRaindropQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

const tableData = ref<G2rainRaindrop[]>([]);

// 基础查询表单（BaseSelectListDto）
let baseQueryForm = reactive<BaseSelectListDto>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务特定查询表单
const queryForm = reactive({
  bizTag: '',
  maxId: '',
  step: '',
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
const currentRow = ref<G2rainRaindrop | null>(null);

const editFormRef = ref<FormInstance | null>(null);

const editForm = reactive({
  id: 0,
  bizTag: '',
  maxId: '',
  step: '',
  description: '',
});

const editRules: FormRules = {
  bizTag: [{ required: true, message: '请输入业务标签', trigger: 'blur' }],
  maxId: [{ required: true, message: '请输入最大 ID', trigger: 'blur' }],
  step: [{ required: true, message: '请输入步长', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editForm.bizTag = '';
  editForm.maxId = '';
  editForm.step = '';
  editForm.description = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: G2rainRaindrop) => {
  isEdit.value = true;
  editForm.id = row.id;
  editForm.bizTag = row.bizTag;
  editForm.maxId = String(row.maxId);
  editForm.step = String(row.step);
  editForm.description = row.description;
  editDialogVisible.value = true;
};

const handleView = (row: G2rainRaindrop) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const handleDelete = (row: G2rainRaindrop) => {
  ElMessageBox.confirm(`确认删除g2rain_raindrop「${row.id}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      try {
        await G2rainRaindropApi.remove(row.id);
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

  const payload: G2rainRaindropPayload = {
    bizTag: editForm.bizTag,
    maxId: Number(editForm.maxId),
    step: Number(editForm.step),
    description: editForm.description,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await G2rainRaindropApi.save(payload);
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
    const query: G2rainRaindropQuery = {
      // 基础查询参数（BaseSelectListDto）- 使用 Object.fromEntries 过滤无效值
      ...Object.fromEntries(
        Object.entries(baseQueryForm).filter(
          ([_, v]) => v != null && (!Array.isArray(v) || v.length > 0)
        )
      ),
      // 业务查询字段
      ...(queryForm.bizTag ? { bizTag: queryForm.bizTag } : {}),
      ...(queryForm.maxId ? { maxId: Number(queryForm.maxId) } : {}),
      ...(queryForm.step ? { step: Number(queryForm.step) } : {}),
      ...(queryForm.description ? { description: queryForm.description } : {}),
    };
    
    // 检查 query 对象是否有有效值
    const hasQuery = Object.values(query).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    });
    
    // 构建查询参数，符合 G2rainRaindropQuery & PageSelectListDto 格式
    const params: G2rainRaindropQuery & PageSelectListDto = {
      // 分页参数
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      // 查询条件（直接展开，仅在有效时包含）
      ...(hasQuery ? query : {}),
    };
    
    const pageData = await G2rainRaindropApi.page(params);
    
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
  queryForm.bizTag = '';
  queryForm.maxId = '';
  queryForm.step = '';
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
.g2rain_raindrop-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.g2rain_raindrop-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.g2rain_raindrop-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.g2rain_raindrop-page__header h2 {
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

.g2rain_raindrop-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.g2rain_raindrop-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

