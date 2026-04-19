<template>
  <div class="i18n_message-page">
    <!-- 查询表单 -->
    <el-card class="i18n_message-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm
        ref="queryFormRef"
        v-model="baseQueryForm"
        @search="handleSearch"
      >
        <!-- 业务特定查询字段 -->
        <el-form-item label="用途 ID">
          <el-select
            v-model="queryForm.messageUsageId"
            filterable
            remote
            reserve-keyword
            clearable
            :remote-method="handleMessageUsageSearch"
            :loading="messageUsageLoading"
            placeholder="请选择用途"
            style="width: 200px"
            @focus="handleMessageUsageSearch('')"
          >
            <el-option
              v-for="item in messageUsageOptions"
              :key="item.id"
              :label="`${item.name}（${item.usageCode}）`"
              :value="String(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="语言代码">
          <el-input v-model="queryForm.languageCode" placeholder="请输入语言代码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="区域代码">
          <el-input v-model="queryForm.regionCode" placeholder="请输入区域代码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="消息编码">
          <el-input v-model="queryForm.messageCode" placeholder="请输入消息编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input v-model="queryForm.messageText" placeholder="请输入消息内容" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="扩展字段">
          <el-input v-model="queryForm.extendField" placeholder="请输入扩展字段" clearable style="width: 200px" />
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
        <h2>管理各类i18n_message数据</h2>
      </div>
      <el-button type="primary" v-permission="'i18n_message:add'" @click="handleCreate">新增i18n_message</el-button>
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
      <el-table-column prop="messageUsageName" label="用途 ID" width="160" />
      <el-table-column prop="languageCode" label="语言代码" width="180" />
      <el-table-column prop="regionCode" label="区域代码" width="180" />
      <el-table-column prop="messageCode" label="消息编码" width="180" />
      <el-table-column prop="messageText" label="消息内容" width="180" />
      <el-table-column prop="extendField" label="扩展字段" width="180" />
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
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑i18n_message' : '新增i18n_message'"
      width="520px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="用途 ID" prop="messageUsageId">
          <el-select
            v-model="editForm.messageUsageId"
            filterable
            remote
            reserve-keyword
            clearable
            :remote-method="handleMessageUsageSearch"
            :loading="messageUsageLoading"
            placeholder="请选择用途"
            style="width: 100%"
            @focus="handleMessageUsageSearch('')"
          >
            <el-option
              v-for="item in messageUsageOptions"
              :key="item.id"
              :label="`${item.name}（${item.usageCode}）`"
              :value="String(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="语言代码" prop="languageCode">
          <el-input v-model="editForm.languageCode" placeholder="请输入语言代码" />
        </el-form-item>
        <el-form-item label="区域代码" prop="regionCode">
          <el-input v-model="editForm.regionCode" placeholder="请输入区域代码" />
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
    <el-dialog v-model="detailDialogVisible" title="i18n_message明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="用途 ID">
          {{ currentRow?.messageUsageId }}
        </el-descriptions-item>
        <el-descriptions-item label="语言代码">
          {{ currentRow?.languageCode }}
        </el-descriptions-item>
        <el-descriptions-item label="区域代码">
          {{ currentRow?.regionCode }}
        </el-descriptions-item>
        <el-descriptions-item label="消息编码">
          {{ currentRow?.messageCode }}
        </el-descriptions-item>
        <el-descriptions-item label="消息内容">
          {{ currentRow?.messageText }}
        </el-descriptions-item>
        <el-descriptions-item label="扩展字段">
          {{ currentRow?.extendField }}
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
import { I18nMessageApi } from './api';
import { I18nMessageUsageApi } from '@/views/i18n_message_usage/api';
import type { I18nMessage, I18nMessagePayload, I18nMessageQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

const tableData = ref<I18nMessage[]>([]);
const messageUsageLoading = ref(false);
const messageUsageOptions = ref<Array<{ id: number; name: string; usageCode: string }>>([]);

// 基础查询表单（BaseSelectListDto）
let baseQueryForm = reactive<BaseSelectListDto>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务特定查询表单
const queryForm = reactive({
  messageUsageId: '',
  languageCode: '',
  regionCode: '',
  messageCode: '',
  messageText: '',
  extendField: '',
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
const currentRow = ref<I18nMessage | null>(null);

const editFormRef = ref<FormInstance | null>(null);

const editForm = reactive({
  id: 0,
  messageUsageId: '',
  languageCode: '',
  regionCode: '',
  messageCode: '',
  messageText: '',
  extendField: '',
});

const editRules: FormRules = {
  messageUsageId: [{ required: true, message: '请输入用途 ID', trigger: 'blur' }],
  languageCode: [{ required: true, message: '请输入语言代码', trigger: 'blur' }],
  regionCode: [{ required: true, message: '请输入区域代码', trigger: 'blur' }],
  messageCode: [{ required: true, message: '请输入消息编码', trigger: 'blur' }],
  messageText: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
  extendField: [{ required: true, message: '请输入扩展字段', trigger: 'blur' }],
};

const loadMessageUsageOptions = async (keyword: string = '') => {
  messageUsageLoading.value = true;
  try {
    const list = await I18nMessageUsageApi.list({
      name: keyword || undefined,
      page: 1,
      size: 10,
    });
    messageUsageOptions.value = list.slice(0, 10).map((item) => ({
      id: item.id,
      name: item.name,
      usageCode: item.usageCode,
    }));
  } catch (error: any) {
    showErrorMessage(error || '加载用途列表失败');
  } finally {
    messageUsageLoading.value = false;
  }
};

const handleMessageUsageSearch = (keyword: string) => {
  loadMessageUsageOptions(keyword?.trim() || '');
};

const handleCreate = () => {
  isEdit.value = false;
  editForm.messageUsageId = '';
  editForm.languageCode = '';
  editForm.regionCode = '';
  editForm.messageCode = '';
  editForm.messageText = '';
  editForm.extendField = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: I18nMessage) => {
  isEdit.value = true;
  editForm.id = row.id;
  editForm.messageUsageId = String(row.messageUsageId);
  editForm.languageCode = row.languageCode;
  editForm.regionCode = row.regionCode;
  editForm.messageCode = row.messageCode;
  editForm.messageText = row.messageText;
  editForm.extendField = row.extendField;
  if (!messageUsageOptions.value.some((item) => item.id === row.messageUsageId)) {
    messageUsageOptions.value.unshift({
      id: row.messageUsageId,
      name: `用途 ${row.messageUsageId}`,
      usageCode: String(row.messageUsageId),
    });
  }
  editDialogVisible.value = true;
};

const handleView = (row: I18nMessage) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const handleDelete = (row: I18nMessage) => {
  ElMessageBox.confirm(`确认删除i18n_message「${row.id}」吗？`, '提示', {
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

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: I18nMessagePayload = {
    messageUsageId: Number(editForm.messageUsageId),
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
    const query: I18nMessageQuery = {
      // 基础查询参数（BaseSelectListDto）- 使用 Object.fromEntries 过滤无效值
      ...Object.fromEntries(
        Object.entries(baseQueryForm).filter(
          ([_, v]) => v != null && (!Array.isArray(v) || v.length > 0)
        )
      ),
      // 业务查询字段
      ...(queryForm.messageUsageId ? { messageUsageId: Number(queryForm.messageUsageId) } : {}),
      ...(queryForm.languageCode ? { languageCode: queryForm.languageCode } : {}),
      ...(queryForm.regionCode ? { regionCode: queryForm.regionCode } : {}),
      ...(queryForm.messageCode ? { messageCode: queryForm.messageCode } : {}),
      ...(queryForm.messageText ? { messageText: queryForm.messageText } : {}),
      ...(queryForm.extendField ? { extendField: queryForm.extendField } : {}),
    };
    
    // 检查 query 对象是否有有效值
    const hasQuery = Object.values(query).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    });
    
    // 构建查询参数，符合 I18nMessageQuery & PageSelectListDto 格式
    const params: I18nMessageQuery & PageSelectListDto = {
      // 分页参数
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      // 查询条件（直接展开，仅在有效时包含）
      ...(hasQuery ? query : {}),
    };
    
    const pageData = await I18nMessageApi.page(params);
    
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
  queryForm.messageUsageId = '';
  queryForm.languageCode = '';
  queryForm.regionCode = '';
  queryForm.messageCode = '';
  queryForm.messageText = '';
  queryForm.extendField = '';
  
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
  loadMessageUsageOptions('');
  loadData();
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

