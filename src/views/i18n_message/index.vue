<template>
  <div class="i18n_message-page">
    <!-- 查询表单 -->
    <el-card class="i18n_message-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item label="消息用途">
          <el-select v-model="queryForm.messageUsageCode" placeholder="请选择业务标签" clearable filterable style="width: 200px">
            <el-option v-for="item in usageOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="语言代码">
          <el-select
            v-model="queryForm.languageCode"
            placeholder="请选择语言代码"
            clearable
            filterable
            style="width: 200px"
            @change="onQueryLanguageChange"
          >
            <el-option v-for="item in languageSelectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域代码">
          <el-select
            v-model="queryForm.regionCode"
            :placeholder="queryForm.languageCode ? '请选择区域代码' : '请先选择语言代码'"
            clearable
            filterable
            style="width: 200px"
            :disabled="!queryForm.languageCode"
          >
            <el-option v-for="item in queryRegionSelectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="消息编码">
          <el-input v-model="queryForm.messageCode" placeholder="请输入消息编码" clearable style="width: 200px" />
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
    <div class="i18n_message-page__header">
      <div class="i18n_message-page__title-group">
        <h2>管理国际化信息数据</h2>
      </div>
      <el-button type="primary" v-permission="'i18n_message:add'" @click="handleCreate">新增国际化信息</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="messageUsageName" label="国际化信息用途" width="160">
        <template #default="{ row }">
          <el-tag>
            {{usageOptions.find(item => item.value === row?.messageUsageCode)?.label || ''}}
          </el-tag>  
        </template>
      </el-table-column>
      <el-table-column prop="languageCode" label="语言代码" width="180" />
      <el-table-column prop="regionCode" label="区域代码" width="180" />
      <el-table-column prop="messageCode" label="消息编码" width="180" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">明细</el-button>
          <el-button type="primary" v-permission="'i18n_message:edit'" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" v-permission="'i18n_message:delete'" link size="small" @click="handleDelete(row)">删除</el-button>
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
    <div class="i18n_message-page__pagination">
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
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑国际化信息' : '新增国际化信息'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="130px">
        <el-form-item label="国际化信息用途" prop="messageUsageCode">
          <el-select v-model="editForm.messageUsageCode" placeholder="请选择业务标签" clearable filterable style="width: 200px">
            <el-option v-for="item in usageOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="语言代码" prop="languageCode">
          <el-select
            v-model="editForm.languageCode"
            placeholder="请选择语言代码"
            clearable
            filterable
            style="width: 100%"
            @change="onEditLanguageChange"
          >
            <el-option v-for="item in editLanguageSelectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域代码" prop="regionCode">
          <el-select
            v-model="editForm.regionCode"
            :placeholder="editForm.languageCode ? '请选择区域代码' : '请先选择语言代码'"
            clearable
            filterable
            style="width: 100%"
            :disabled="!editForm.languageCode"
          >
            <el-option v-for="item in editRegionSelectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="消息编码" prop="messageCode">
          <el-input v-model="editForm.messageCode" placeholder="请输入消息编码" />
        </el-form-item>
        <el-form-item label="消息内容" prop="messageText">
          <el-input v-model="editForm.messageText" placeholder="请输入消息内容" />
        </el-form-item>
        <el-form-item label="扩展字段" prop="extendField">
          <el-input v-model="editForm.extendField" placeholder="请输入扩展字段" />
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
    <el-dialog v-model="detailDialogVisible" title="国际化信息明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="国际化信息用途">
          <el-tag>
            {{usageOptions.find(item => item.value === currentRow?.messageUsageCode)?.label || ''}}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="语言代码">{{ currentRow?.languageCode }}</el-descriptions-item>
        <el-descriptions-item label="区域代码">{{ currentRow?.regionCode }}</el-descriptions-item>
        <el-descriptions-item label="消息编码">{{ currentRow?.messageCode }}</el-descriptions-item>
        <el-descriptions-item label="消息内容">{{ currentRow?.messageText }}</el-descriptions-item>
        <el-descriptions-item label="扩展字段">{{ currentRow?.extendField }}</el-descriptions-item>
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
import { ref, reactive, computed, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { I18nMessageApi } from './api';
import { LocaleSettingApi, type LanguageCountriesMap } from '../locale_setting/api';
import type { I18nMessage, I18nMessagePayload, I18nMessageQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

// 定义字典引用
const usageOptions = ref<Array<{ label: string; value: string }>>([]);

/** 语言 → 区域代码列表（来自 get_language_countries） */
const languageCountryMap = ref<LanguageCountriesMap>({});

const regionOptionsForLanguage = (lang: string) => {
  const regions = lang ? languageCountryMap.value[lang] : undefined;
  if (!regions?.length) return [];
  return [...regions].sort().map(code => ({ value: code, label: code }));
};

const languageSelectOptions = computed(() =>
  Object.keys(languageCountryMap.value)
    .sort()
    .map(code => ({ value: code, label: code })),
);

/** 编辑弹窗：若库里已有语言不在 JDK Locale 映射中，仍展示为可选项 */
const editLanguageSelectOptions = computed(() => {
  const base = languageSelectOptions.value;
  const lc = editForm.languageCode;
  if (lc && !base.some(o => o.value === lc)) {
    return [...base, { value: lc, label: lc }].sort((a, b) => a.value.localeCompare(b.value));
  }
  return base;
});

const queryRegionSelectOptions = computed(() => regionOptionsForLanguage(queryForm.languageCode));

const editRegionSelectOptions = computed(() => {
  let opts = regionOptionsForLanguage(editForm.languageCode);
  const rc = editForm.regionCode;
  if (rc && !opts.some(o => o.value === rc)) {
    opts = [{ value: rc, label: rc }, ...opts];
  }
  return opts;
});

const onQueryLanguageChange = () => {
  const regions = languageCountryMap.value[queryForm.languageCode];
  if (queryForm.regionCode && (!regions || !regions.includes(queryForm.regionCode))) {
    queryForm.regionCode = '';
  }
};

const onEditLanguageChange = () => {
  const regions = languageCountryMap.value[editForm.languageCode];
  if (editForm.regionCode && (!regions || !regions.includes(editForm.regionCode))) {
    editForm.regionCode = '';
  }
};

// 获取字典信息
const loadDicts = async () => {
  const list = await I18nMessageApi.i18nMessageUsages();
  usageOptions.value = list.map(u => ({
    value: u.code,
    label: u.name,
  }));

  try {
    languageCountryMap.value = await LocaleSettingApi.getLanguageCountries();
  } catch (error: any) {
    showErrorMessage(error || '加载语言国家数据失败');
  }
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
  messageUsageCode: '',
  languageCode: '',
  regionCode: '',
  messageCode: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<I18nMessage[]>([]);

const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as I18nMessageQuery;

    // 请求分页数据
    const pageData = await I18nMessageApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & I18nMessageQuery);
        
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
  queryForm.messageUsageCode = '';
  queryForm.languageCode = '';
  queryForm.regionCode = '';
  queryForm.messageCode = '';  
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
const currentRow = ref<I18nMessage | null>(null);

  // 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细
const handleView = (row: I18nMessage) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: I18nMessage) => {
  ElMessageBox.confirm(`确认删除国际化信息「${row.id}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      try {
        await I18nMessageApi.remove(row.id);
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
  messageUsageCode: '',
  languageCode: '',
  regionCode: '',
  messageCode: '',
  messageText: '',
  extendField: undefined as string | undefined,
});

// 表单校验规则 
const editRules: FormRules = {
  messageUsageCode: [{ required: true, message: '请选择消息用途', trigger: 'blur' }],
  languageCode: [{ required: true, message: '请选择语言代码', trigger: 'change' }],
  messageCode: [{ required: true, message: '请输入消息编码', trigger: 'blur' }],
  messageText: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
};

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.messageUsageCode = '';
  editForm.languageCode = '';
  editForm.regionCode = '';
  editForm.messageCode = '';
  editForm.messageText = '';
  editForm.extendField = undefined;
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: I18nMessage) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.messageUsageCode = row.messageUsageCode;
  editForm.languageCode = row.languageCode;
  editForm.regionCode = row.regionCode;
  editForm.messageCode = row.messageCode;
  editForm.messageText = row.messageText;
  editForm.extendField = row.extendField;
  editDialogVisible.value = true;
};

// 提交数据表单
const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: I18nMessagePayload = {
    messageUsageCode: editForm.messageUsageCode,
    languageCode: editForm.languageCode,
    regionCode: editForm.regionCode,
    messageCode: editForm.messageCode,
    messageText: editForm.messageText,
    extendField: editForm.extendField,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await I18nMessageApi.save(payload);
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
.i18n_message-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.i18n_message-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.i18n_message-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.i18n_message-page__header h2 {
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

.i18n_message-page__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.i18n_message-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

