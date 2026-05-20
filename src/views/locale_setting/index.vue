<template>
  <div class="locale_setting-page">
    <!-- 查询表单 -->
    <el-card class="locale_setting-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item label="编码">
          <el-select v-model="queryForm.code" placeholder="请选择编码" clearable filterable style="width: 200px">
            <el-option v-for="item in localeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="queryForm.name" placeholder="请输入名称" clearable style="width: 200px" />
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
    <div class="locale_setting-page__header">
      <div class="locale_setting-page__title-group">
        <h2>管理地区语言数据</h2>
      </div>
      <el-button type="primary" v-permission="'locale_setting:add'" @click="handleCreate">新增地区语言</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" label="地区语言标识" width="120" />
      <el-table-column prop="code" label="编码" width="180" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="sortIndex" label="排序" width="140" />
      <el-table-column prop="description" label="描述" width="180" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">明细</el-button>
          <el-button type="primary" v-permission="'locale_setting:edit'" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" v-permission="'locale_setting:delete'" link size="small" @click="handleDelete(row)">删除</el-button>
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
    <div class="locale_setting-page__pagination">
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
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑地区语言' : '新增地区语言'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item label="编码" prop="code">
          <el-select v-model="editForm.code" :disabled="isEdit" placeholder="请选择编码" filterable style="width: 200px">
            <el-option v-for="item in localeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sortIndex">
          <el-input-number
            v-model="editForm.sortIndex"
            :min="0"
            :step="1"
            :precision="0"
            controls-position="right"
            placeholder="请输入排序"
            style="width: 100%"
          />
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
    <el-dialog v-model="detailDialogVisible" title="地区语言明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="编码">
          <el-tag>
            {{localeOptions.find(item => item.value === currentRow?.code)?.label || ''}}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="名称">{{ currentRow?.name }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ currentRow?.sortIndex }}</el-descriptions-item>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { LocaleSettingApi } from './api';
import type { LocaleSetting, LocaleSettingPayload, LocaleSettingQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

// 定义字典引用
const localeOptions = ref<Array<{ label: string; value: string }>>([]);

// 获取字典信息
const loadDicts = async () => {
  const list = await LocaleSettingApi.localeDict();
  localeOptions.value = list.map(u => ({
    value: u,
    label: u,
  }));
};

// 组件引用
const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);

// 基础查询表单（BaseSelectListDto）
let baseQueryForm = reactive<BaseSelectListDto>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务特定查询表单
const queryForm = reactive({
  code: '',
  name: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<LocaleSetting[]>([]);

const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as LocaleSettingQuery;

    // 请求分页数据
    const pageData = await LocaleSettingApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & LocaleSettingQuery);
    
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
  baseQueryForm.id = undefined;
  baseQueryForm.createTime = undefined;
  baseQueryForm.updateTime = undefined;
  baseQueryForm.sorts = undefined;
  
  // 重置业务特定查询表单
  queryForm.code = '';
  queryForm.name = '';
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
const currentRow = ref<LocaleSetting | null>(null);
// 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细
const handleView = (row: LocaleSetting) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: LocaleSetting) => {
  ElMessageBox.confirm(`确认删除地区语言「${row.id}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      try {
        await LocaleSettingApi.remove(row.id);
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
  code: '',
  name: '',
  sortIndex: undefined as number | undefined,
  description: '',
});

// 表单校验规则 
const editRules: FormRules = {
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  sortIndex: [{ required: true, message: '请输入排序', trigger: 'blur' }],
};

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.code = '';
  editForm.name = '';
  editForm.sortIndex = 0;
  editForm.description = '';
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: LocaleSetting) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.code = row.code;
  editForm.name = row.name;
  editForm.sortIndex = row.sortIndex;
  editForm.description = row.description;
  editDialogVisible.value = true;
};

// 提交数据表单
const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: LocaleSettingPayload = {
    code: editForm.code,
    name: editForm.name,
    sortIndex: editForm.sortIndex,
    description: editForm.description,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await LocaleSettingApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: any) {
    showErrorMessage(error || '保存失败');
  }
};

// 挂载回调
onMounted(async() => {
  // 先准备字典
  await loadDicts();
  // 再查询列表
  await loadData();
});
</script>

<style scoped>
.locale_setting-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.locale_setting-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.locale_setting-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.locale_setting-page__header h2 {
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

.locale_setting-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.locale_setting-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

