<template>
  <div class="dictionary_usage-page">
    <!-- 查询表单 -->
    <el-card class="dictionary_usage-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item label="用途编码">
          <el-input v-model="queryForm.usageCode" placeholder="请输入用途编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="用途名称">
          <el-input v-model="queryForm.usageName" placeholder="请输入用途名称" clearable style="width: 200px" />
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
        <h2>管理字典用途数据</h2>
      </div>
      <el-button type="primary"  @click="handleCreate">新增字典用途</el-button> <!--v-permission="'dictionary_usage:add'"-->
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" label="用途标识" width="210" />
      <el-table-column prop="usageCode" label="用途编码" width="210" />
      <el-table-column prop="usageName" label="用途名称" width="210" />
      <el-table-column prop="description" label="描述" width="280" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="210">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">明细</el-button>
          <el-button type="primary" link size="small" @click="openDictionaryItems(row)">字典项</el-button> <!--v-permission="'dictionary_usage:items'" -->
          <el-button type="primary"  link size="small" @click="handleEdit(row)">编辑</el-button> <!--v-permission="'dictionary_usage:edit'"-->
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button> <!--v-permission="'dictionary_usage:delete'" -->
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
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑字典用途' : '新增字典用途'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
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
    <el-dialog v-model="detailDialogVisible" title="字典用途明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用途标识">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="用途编码">{{ currentRow?.usageCode }}</el-descriptions-item>
        <el-descriptions-item label="用途名称">{{ currentRow?.usageName }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ currentRow?.description }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer v-model="itemDrawerVisible" :title="itemDrawerTitle" direction="rtl" size="90%" destroy-on-close class="dictionary_usage-item-drawer">
      <DictionaryItemPanel v-if="itemDrawerUsageCode != ''" :dictionary-usage-code="itemDrawerUsageCode" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { DictionaryUsageApi } from './api';
import type { DictionaryUsage, DictionaryUsagePayload, DictionaryUsageQuery } from './type';
import type { PageSelectListDto } from '@platform/types/api.type';
import type { QueryFormData } from '@/components/QueryForm';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';
import DictionaryItemPanel from './components/DictionaryItemPanel.vue';

// 组件引用
const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);

// 基础查询表单（与 QueryForm 的 QueryFormData 对齐）
const baseQueryForm = ref<QueryFormData>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务特定查询表单
const queryForm = reactive({
  usageCode: '',
  usageName: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DictionaryUsage[]>([]);

const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm.value, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DictionaryUsageQuery;

    // 请求分页数据
    const pageData = await DictionaryUsageApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DictionaryUsageQuery);
        
    // 设置响应结果 
    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: any) {
    showErrorMessage(error || '加载列表失败');
  }
};

// 处理排序变化
const handleSortChange = (params: Record<string, string>) => {
  // 更新 QueryForm 的 sorts 字段
  queryFormRef.value?.updateSorts(params);
};

// 查询
const handleSearch = () => {
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 重置查询条件
const handleReset = () => {
  // 重置基础查询表单
  baseQueryForm.value.id = undefined;
  baseQueryForm.value.createTime = undefined;
  baseQueryForm.value.updateTime = undefined;
  baseQueryForm.value.sorts = undefined;
  
  // 重置业务特定查询表单
  queryForm.usageCode = '';
  queryForm.usageName = '';
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

// 当前记录引用
const currentRow = ref<DictionaryUsage | null>(null);

// 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细
const handleView = (row: DictionaryUsage) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: DictionaryUsage) => {
  ElMessageBox.confirm(`确认删除字典用途「${row.id}」吗？`, '提示', {
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

// 保存弹窗引用
const editDialogVisible = ref(false);

// 修改标记状态
const isEdit = ref(false);

// 修改组件引用
const editFormRef = ref<FormInstance | null>(null);

  // 保存表单状态
const editForm = reactive({
  id: undefined as number | undefined,
  usageCode: '',
  usageName: '',
  description: '',
});

// 表单校验规则 
const editRules: FormRules = {
  usageCode: [{ required: true, message: '请输入用途编码', trigger: 'blur' }],
  usageName: [{ required: true, message: '请输入用途名称', trigger: 'blur' }],
};

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.usageCode = '';
  editForm.usageName = '';
  editForm.description = '';
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: DictionaryUsage) => {
  isEdit.value = true;
   editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.usageCode = row.usageCode;
  editForm.usageName = row.usageName;
  editForm.description = row.description;
  editDialogVisible.value = true;
};

// 提交数据表单
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

const itemDrawerVisible = ref(false);
const itemDrawerUsageCode = ref('');
const itemDrawerLabel = ref('');

const itemDrawerTitle = computed(() =>
  itemDrawerLabel.value ? `字典项 — ${itemDrawerLabel.value}` : '字典项',
);

const openDictionaryItems = (row: DictionaryUsage) => {
  itemDrawerUsageCode.value = row.usageCode;
  itemDrawerLabel.value = row.usageName || row.usageCode || String(row.id);
  itemDrawerVisible.value = true;
};

// 挂载回调
onMounted(() => {
  // 查询列表
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

