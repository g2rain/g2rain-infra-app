<template>
  <div class="dictionary_usage-page">
    <!-- 查询表单 -->
    <el-card class="dictionary_usage-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm
        ref="queryFormRef"
        v-model="baseQueryForm"
        @search="handleSearch"
      >
        <!-- 业务特定查询字段 -->
        <el-form-item label="用途编码">
          <el-input v-model="queryForm.usageCode" placeholder="请输入用途编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="用途名称">
          <el-input v-model="queryForm.usageName" placeholder="请输入用途名称" clearable style="width: 200px" />
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
    <div class="dictionary_usage-page__header">
      <div class="dictionary_usage-page__title-group">
        <h2>管理各类dictionary_usage数据</h2>
      </div>
      <el-button type="primary" v-permission="'dictionary_usage:add'" @click="handleCreate">
        新增dictionary_usage
      </el-button>
    </div>

    <SortableTable
      :data="tableData"
      border
      stripe
      style="width: 100%"
      :enable-multi-sort="true"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="usageCode" label="用途编码" width="210" />
      <el-table-column prop="usageName" label="用途名称" width="210" />
      <el-table-column prop="description" label="描述" width="280" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="210">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">
            明细
          </el-button>
          <el-button
            type="primary"
            v-permission="'dictionary_usage:items'"
            link
            size="small"
            @click="openDictionaryItems(row)"
          >
            字典项
          </el-button>
          <el-button type="primary" v-permission="'dictionary_usage:edit'" link size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" v-permission="'dictionary_usage:delete'" link size="small" @click="handleDelete(row)">
            删除
          </el-button>
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
    <div class="dictionary_usage-page__pagination">
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
      :title="isEdit ? '编辑dictionary_usage' : '新增dictionary_usage'"
      width="520px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="用途编码" prop="usageCode">
          <el-input v-model="editForm.usageCode" placeholder="请输入用途编码" />
        </el-form-item>
        <el-form-item label="用途名称" prop="usageName">
          <el-input v-model="editForm.usageName" placeholder="请输入用途名称" />
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
    <el-dialog v-model="detailDialogVisible" title="dictionary_usage明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="用途编码">
          {{ currentRow?.usageCode }}
        </el-descriptions-item>
        <el-descriptions-item label="用途名称">
          {{ currentRow?.usageName }}
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

    <el-drawer
      v-model="itemDrawerVisible"
      :title="itemDrawerTitle"
      direction="rtl"
      size="90%"
      destroy-on-close
      class="dictionary_usage-item-drawer"
    >
      <DictionaryItemPanel v-if="itemDrawerUsageId > 0" :dictionary-usage-id="itemDrawerUsageId" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { DictionaryUsageApi } from './api';
import type { DictionaryUsage, DictionaryUsagePayload, DictionaryUsageQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import type { QueryFormData } from '@/components/QueryForm';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';
import DictionaryItemPanel from './components/DictionaryItemPanel.vue';

const tableData = ref<DictionaryUsage[]>([]);

// 基础查询表单（与 QueryForm 的 QueryFormData 对齐）
let baseQueryForm = reactive<QueryFormData>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务特定查询表单
const queryForm = reactive({
  usageCode: '',
  usageName: '',
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
const currentRow = ref<DictionaryUsage | null>(null);

const editFormRef = ref<FormInstance | null>(null);

const itemDrawerVisible = ref(false);
const itemDrawerUsageId = ref(0);
const itemDrawerLabel = ref('');

const itemDrawerTitle = computed(() =>
  itemDrawerLabel.value ? `字典项 — ${itemDrawerLabel.value}` : '字典项',
);

const editForm = reactive({
  id: 0,
  usageCode: '',
  usageName: '',
  description: '',
});

const editRules: FormRules = {
  usageCode: [{ required: true, message: '请输入用途编码', trigger: 'blur' }],
  usageName: [{ required: true, message: '请输入用途名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editForm.usageCode = '';
  editForm.usageName = '';
  editForm.description = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: DictionaryUsage) => {
  isEdit.value = true;
  editForm.id = row.id;
  editForm.usageCode = row.usageCode;
  editForm.usageName = row.usageName;
  editForm.description = row.description;
  editDialogVisible.value = true;
};

const handleView = (row: DictionaryUsage) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const openDictionaryItems = (row: DictionaryUsage) => {
  itemDrawerUsageId.value = row.id;
  itemDrawerLabel.value = row.usageName || row.usageCode || String(row.id);
  itemDrawerVisible.value = true;
};

const handleDelete = (row: DictionaryUsage) => {
  ElMessageBox.confirm(`确认删除dictionary_usage「${row.id}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      try {
        await DictionaryUsageApi.remove(row.id);
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

  const payload: DictionaryUsagePayload = {
    usageCode: editForm.usageCode,
    usageName: editForm.usageName,
    description: editForm.description,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DictionaryUsageApi.save(payload);
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
    const query: DictionaryUsageQuery = {
      // 基础查询参数（BaseSelectListDto）- 使用 Object.fromEntries 过滤无效值
      ...Object.fromEntries(
        Object.entries(baseQueryForm).filter(
          ([_, v]) => v != null && (!Array.isArray(v) || v.length > 0)
        )
      ),
      // 业务查询字段
      ...(queryForm.usageCode ? { usageCode: queryForm.usageCode } : {}),
      ...(queryForm.usageName ? { usageName: queryForm.usageName } : {}),
      ...(queryForm.description ? { description: queryForm.description } : {}),
    };
    
    // 检查 query 对象是否有有效值
    const hasQuery = Object.values(query).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    });
    
    // 构建查询参数，符合 DictionaryUsageQuery & PageSelectListDto 格式
    const params: DictionaryUsageQuery & PageSelectListDto = {
      // 分页参数
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      // 查询条件（直接展开，仅在有效时包含）
      ...(hasQuery ? query : {}),
    };
    
    const pageData = await DictionaryUsageApi.page(params);
    
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
  queryForm.usageCode = '';
  queryForm.usageName = '';
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
.dictionary_usage-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.dictionary_usage-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.dictionary_usage-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dictionary_usage-page__header h2 {
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

.dictionary_usage-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.dictionary_usage-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

