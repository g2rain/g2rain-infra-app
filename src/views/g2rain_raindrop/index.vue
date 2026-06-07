<template>
  <div class="g2rain_raindrop-page">
    <!-- 查询表单 -->
    <el-card class="g2rain_raindrop-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_BIZ_TAG', '业务标签')">
          <el-select v-model="queryForm.bizTag" :placeholder="$t('INFRA_G2RAIN_RAINDROP_PH_BIZ_TAG_SEL', '请选择业务标签')" clearable filterable style="width: 200px">
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_MAX_ID', '最大 ID')">
          <el-input v-model="queryForm.maxId" :placeholder="$t('INFRA_G2RAIN_RAINDROP_PH_MAX_ID', '请输入最大 ID')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_STEP', '步长')">
          <el-input v-model="queryForm.step" :placeholder="$t('INFRA_G2RAIN_RAINDROP_PH_STEP', '请输入步长')" clearable style="width: 200px" />
        </el-form-item>
        <!-- 操作按钮 -->
        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
            <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <!-- 标题和操作按钮 -->
    <div class="g2rain_raindrop-page__header">
      <div class="g2rain_raindrop-page__title-group">
        <h2>{{ $t('INFRA_G2RAIN_RAINDROP_TITLE', '管理发号器数据') }}</h2>
      </div>
      <el-button type="primary" v-permission="'g2rain_raindrop:add'" @click="handleCreate">{{ $t('INFRA_G2RAIN_RAINDROP_BTN_ADD', '新增发号器') }}</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('INFRA_G2RAIN_RAINDROP_COL_ID', '发号器标识')" width="120" />
      <el-table-column prop="bizTag" :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_BIZ_TAG', '业务标签')" width="180" />
      <el-table-column prop="maxId" :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_MAX_ID', '最大 ID')" width="140" />
      <el-table-column prop="step" :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_STEP', '步长')" width="140" />
      <TableColumn prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" :sortable="true" />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" :sortable="true" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" v-permission="'g2rain_raindrop:edit'" link size="small" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button type="danger" v-permission="'g2rain_raindrop:delete'" link size="small" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>{{ $t('G2_FIELD_ACTION', '操作') }}</span>
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
    <el-dialog v-model="editDialogVisible" :title="editDialogTitle" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_BIZ_TAG', '业务标签')" prop="bizTag">
          <el-input v-model="editForm.bizTag" :placeholder="$t('INFRA_G2RAIN_RAINDROP_PH_BIZ_TAG', '请输入业务标签')" />
        </el-form-item>
        <el-form-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_MAX_ID', '最大 ID')" prop="maxId">
          <el-input-number
            v-model="editForm.maxId"
            :min="0"
            :step="1"
            :precision="0"
            controls-position="right"
            :placeholder="$t('INFRA_G2RAIN_RAINDROP_PH_MAX_ID', '请输入最大 ID')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_STEP', '步长')" prop="step">
          <el-input-number
            v-model="editForm.step"
            :min="0"
            :step="1"
            :precision="0"
            controls-position="right"
            :placeholder="$t('INFRA_G2RAIN_RAINDROP_PH_STEP', '请输入步长')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_DESC', '描述')" prop="description">
          <el-input v-model="editForm.description" :placeholder="$t('G2_PH_DESC', '请输入描述')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">{{ $t('G2_BTN_CANCEL', '取消') }}</el-button>
          <el-button type="primary" @click="submitEdit">{{ $t('G2_BTN_SAVE', '保存') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 明细弹窗 -->
    <el-dialog v-model="detailDialogVisible" :title="$t('INFRA_G2RAIN_RAINDROP_DETAIL', '发号器明细')" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('G2_FIELD_ID', 'ID')">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_BIZ_TAG', '业务标签')">
          {{ currentRow?.bizTag }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_MAX_ID', '最大 ID')">
          {{ currentRow?.maxId }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('INFRA_G2RAIN_RAINDROP_FIELD_STEP', '步长')">
          {{ currentRow?.step }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_DESC', '描述')">
          {{ currentRow?.description }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_CREATE_TIME', '创建时间')">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">{{ $t('G2_BTN_CLOSE', '关闭') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { t } from '@platform/i18n';
import { G2rainRaindropApi } from './api';
import type { G2rainRaindrop, G2rainRaindropPayload, G2rainRaindropQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';

import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

// 定义字典引用
const tagOptions = ref<Array<{ label: string; value: string }>>([]);

// 获取字典信息
const loadDicts = async () => {
  const list = await G2rainRaindropApi.bizTagDict();
  tagOptions.value = list.map(u => ({
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
  bizTag: '',
  maxId: '',
  step: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<G2rainRaindrop[]>([]);

const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as G2rainRaindropQuery;

    // 请求分页数据
    const pageData = await G2rainRaindropApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & G2rainRaindropQuery);
        
    // 设置响应结果 
    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : t('G2_MSG_LOAD_FAIL', '加载列表失败');
    showErrorMessage(msg);
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
  queryForm.bizTag = '';
  queryForm.maxId = '';
  queryForm.step = '';
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
const currentRow = ref<G2rainRaindrop | null>(null);

// 明细弹窗引用
const detailDialogVisible = ref(false);  

// 查询数据明细
const handleView = (row: G2rainRaindrop) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: G2rainRaindrop) => {
  ElMessageBox.confirm(
    t('INFRA_G2RAIN_RAINDROP_DEL_CONFIRM', `确认删除发号器「${row.id}」吗？`),
    t('G2_LBL_TIP', '提示'),
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await G2rainRaindropApi.remove(row.id);
        // 如果当前页只有一条数据，删除后应该跳转到上一页
        if (tableData.value.length === 1 && pagination.pageNum > 1) {
          pagination.pageNum--;
        }

        await loadDicts();
        await loadData();
        ElMessage.success(t('G2_MSG_DELETE_OK', '删除成功'));
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : t('G2_MSG_DELETE_FAIL', '删除失败');
        showErrorMessage(msg);
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
  bizTag: '',
  maxId: undefined as number | undefined,
  step: undefined as number | undefined,
  description: '',
});

const editDialogTitle = computed(() =>
  isEdit.value ? t('INFRA_G2RAIN_RAINDROP_DLG_EDIT', '编辑发号器') : t('INFRA_G2RAIN_RAINDROP_DLG_ADD', '新增发号器'),
);

// 表单校验规则 
const editRules = computed<FormRules>(() => ({
  bizTag: [{ required: true, message: t('INFRA_G2RAIN_RAINDROP_VLD_BIZ_TAG', '请输入业务标签'), trigger: 'blur' }],
  maxId: [{ required: true, message: t('INFRA_G2RAIN_RAINDROP_VLD_MAX_ID', '请输入最大 ID'), trigger: 'blur' }],
  step: [{ required: true, message: t('INFRA_G2RAIN_RAINDROP_VLD_STEP', '请输入步长'), trigger: 'blur' }],
}));

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.bizTag = '';
  editForm.maxId = 0;
  editForm.step = 0;
  editForm.description = '';
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: G2rainRaindrop) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.bizTag = row.bizTag;
  editForm.maxId = row.maxId;
  editForm.step = row.step;
  editForm.description = row.description;
  editDialogVisible.value = true;
};

// 提交数据表单
const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: G2rainRaindropPayload = {
    bizTag: editForm.bizTag,
    maxId: editForm.maxId,
    step: editForm.step,
    description: editForm.description,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await G2rainRaindropApi.save(payload);
    ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
    
    // 保存功能需要查询字典
    if (!isEdit.value) {
      await loadDicts();
    }

    await loadData();
    editDialogVisible.value = false;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : t('G2_MSG_SAVE_FAIL', '保存失败');
    showErrorMessage(msg);
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
