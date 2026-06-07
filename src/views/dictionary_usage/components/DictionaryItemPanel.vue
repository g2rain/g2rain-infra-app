<template>
  <div class="dictionary-item-panel">
    <el-card class="dictionary-item-panel__search" shadow="never">
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <el-form-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_PARENT', '上级节点')">
          <el-input v-model="queryForm.parentId" :placeholder="$t('INFRA_DICTIONARY_ITEM_PH_PARENT', '请输入上级节点')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_CODE', '编码')">
          <el-input v-model="queryForm.code" :placeholder="$t('INFRA_DICTIONARY_ITEM_PH_CODE', '请输入编码')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_NAME', '名称')">
          <el-input v-model="queryForm.name" :placeholder="$t('INFRA_DICTIONARY_ITEM_PH_NAME', '请输入名称')" clearable style="width: 200px" />
        </el-form-item>
        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
            <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <div class="dictionary-item-panel__header">
      <div class="dictionary-item-panel__title-group">
        <h3>{{ panelTitle }}</h3>
      </div>
      <el-button type="primary" v-permission="'dictionary_item:add'" @click="handleCreate">{{ $t('INFRA_DICTIONARY_ITEM_BTN_ADD', '新增字典项') }}</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('INFRA_DICTIONARY_ITEM_COL_ID', '当前节点')" width="120" />
      <el-table-column prop="parentName" :label="$t('INFRA_DICTIONARY_ITEM_FIELD_PARENT', '上级节点')" width="140">
        <template #default="{ row }">
          {{ row.parentName || $t('INFRA_DICTIONARY_ITEM_LBL_ROOT', '根节点') }}
        </template>
      </el-table-column>
      <el-table-column prop="code" :label="$t('INFRA_DICTIONARY_ITEM_FIELD_CODE', '编码')" width="180" />
      <el-table-column prop="name" :label="$t('INFRA_DICTIONARY_ITEM_FIELD_NAME', '名称')" width="180" />
      <el-table-column prop="sortIndex" :label="$t('G2_LBL_SORT', '排序')" width="140" />
      <TableColumn prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" :sortable="true" />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" :sortable="true" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" v-permission="'dictionary_item:edit'" link size="small" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button type="danger" v-permission="'dictionary_item:delete'" link size="small" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>{{ $t('G2_FIELD_ACTION', '操作') }}</span>
            <SortManagerButton />
          </div>
        </template>
      </el-table-column>
    </SortableTable>

    <div class="dictionary-item-panel__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="editDialogTitle" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_PARENT', '上级节点')" prop="parentId">
          <el-tree-select
            v-model="editParentIdForTree"
            :data="parentTreeData"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            check-strictly
            clearable
            filterable
            default-expand-all
            :loading="parentTreeLoading"
            :placeholder="$t('INFRA_DICTIONARY_ITEM_PH_PARENT_SEL', '请选择上级节点')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_CODE', '编码')" prop="code">
          <el-input v-model="editForm.code" :placeholder="$t('INFRA_DICTIONARY_ITEM_PH_CODE', '请输入编码')" />
        </el-form-item>
        <el-form-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_NAME', '名称')" prop="name">
          <el-input v-model="editForm.name" :placeholder="$t('INFRA_DICTIONARY_ITEM_PH_NAME', '请输入名称')" />
        </el-form-item>
        <el-form-item :label="$t('G2_LBL_SORT', '排序')" prop="sortIndex">
          <el-input-number
            v-model="editForm.sortIndex"
            :min="0"
            :step="1"
            :precision="0"
            controls-position="right"
            :placeholder="$t('INFRA_DICTIONARY_ITEM_PH_SORT', '请输入排序')"
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

    <el-dialog v-model="detailDialogVisible" :title="$t('INFRA_DICTIONARY_ITEM_DETAIL', '字典项明细')" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('INFRA_DICTIONARY_ITEM_COL_ID', '当前节点')">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_PARENT', '上级节点')">{{ currentRow?.parentName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_CODE', '编码')">{{ currentRow?.code }}</el-descriptions-item>
        <el-descriptions-item :label="$t('INFRA_DICTIONARY_ITEM_FIELD_NAME', '名称')">{{ currentRow?.name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_LBL_SORT', '排序')">{{ currentRow?.sortIndex }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_DESC', '描述')">{{ currentRow?.description }}</el-descriptions-item>
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
import { ref, reactive, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { t } from '@platform/i18n';
import { DictionaryItemApi } from '@/views/dictionary_usage/dictionary_item/api';
import type { DictionaryItem, DictionaryItemPayload, DictionaryItemQuery, DictionaryItemTree} from '@/views/dictionary_usage/dictionary_item/type';
import type { PageSelectListDto } from '@platform/types/api.type';
import type { QueryFormData } from '@/components/QueryForm';
import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

const props = defineProps<{
  dictionaryUsageCode: string;
}>();

const panelTitle = computed(() =>
  t('INFRA_DICTIONARY_ITEM_TITLE', `字典项（字典用途：${props.dictionaryUsageCode}）`),
);

// 组件引用
const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);

// 基础查询表单（与 QueryForm 的 QueryFormData 对齐）
let baseQueryForm = reactive<QueryFormData>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务特定查询表单
const queryForm = reactive({
  parentId: undefined as number | undefined,
  code: '',
  name: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const tableData = ref<DictionaryItem[]>([]);

const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm, ...queryForm, usageCode: props.dictionaryUsageCode})
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as DictionaryItemQuery;

    // 请求分页数据
    const pageData = await DictionaryItemApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & DictionaryItemQuery);

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
  queryFormRef.value?.updateSorts(params);
};

// 查询
const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

// 重置查询条件
const handleReset = () => {
  resetQueryFields();
  pagination.pageNum = 1;
  loadData();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  loadData();
};

// 页码变化
const handlePageChange = (page: number) => {
  pagination.pageNum = page;
  loadData();
};

// 当前记录引用
const currentRow = ref<DictionaryItem | null>(null);

// 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细
const handleView = (row: DictionaryItem) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: DictionaryItem) => {
  ElMessageBox.confirm(
    t('INFRA_DICTIONARY_ITEM_DEL_CONFIRM', `确认删除字典项「${row.id}」吗？`),
    t('G2_LBL_TIP', '提示'),
    { type: 'warning' },
  )
    .then(async () => {
      try {
        await DictionaryItemApi.remove(row.id);
        if (tableData.value.length === 1 && pagination.pageNum > 1) {
          pagination.pageNum--;
        }
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
  parentId: undefined as number | undefined,
  code: '',
  name: '',
  sortIndex: undefined as number | undefined,
  description: '',
});

const editDialogTitle = computed(() =>
  isEdit.value ? t('INFRA_DICTIONARY_ITEM_DLG_EDIT', '编辑字典项') : t('INFRA_DICTIONARY_ITEM_DLG_ADD', '新增字典项'),
);

// 表单校验规则 
const editRules = computed<FormRules>(() => ({
  code: [{ required: true, message: t('INFRA_DICTIONARY_ITEM_VLD_CODE', '请输入编码'), trigger: 'blur' }],
  name: [{ required: true, message: t('INFRA_DICTIONARY_ITEM_VLD_NAME', '请输入名称'), trigger: 'blur' }],
  sortIndex: [{ required: true, message: t('INFRA_DICTIONARY_ITEM_VLD_SORT', '请输入排序'), trigger: 'blur' }],
}));

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.parentId = undefined as number | undefined;
  editForm.code = '';
  editForm.name = '';
  editForm.sortIndex = 0;
  editForm.description = '';
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: DictionaryItem) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.parentId = row.parentId;
  editForm.code = row.code;
  editForm.name = row.name;
  editForm.sortIndex = row.sortIndex;
  editForm.description = row.description;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: DictionaryItemPayload = {
    parentId: editForm.parentId,
    usageCode: props.dictionaryUsageCode,
    code: editForm.code,
    name: editForm.name,
    sortIndex: editForm.sortIndex,
    description: editForm.description,
  };

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DictionaryItemApi.save(payload);
    ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
    await loadData();
    editDialogVisible.value = false;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : t('G2_MSG_SAVE_FAIL', '保存失败');
    showErrorMessage(msg);
  }
};

const parentTreeData = ref<DictionaryItemTree[]>([]);
const parentTreeLoading = ref(false);

/** 与 el-tree-select 的 v-model（number | undefined）同步到 editForm.parentId 字符串 */
const editParentIdForTree = computed<number | undefined>({
  get() {
    const s = editForm.parentId;
    if (s === undefined || s == null) return undefined;
    const n = Number(s);
    return Number.isNaN(n) ? undefined : n;
  },
  set(v: number | string | null | undefined) {
    if (v === null || v === undefined || v === '') {
      editForm.parentId = undefined;
      return;
    }
    editForm.parentId = Number(v);
  },
});

function createTopLevelTreeOption(dictionaryUsageCode: string): DictionaryItemTree {
  return {
    id: 0,
    parentId: undefined,
    usageCode: dictionaryUsageCode,
    code: '',
    name: t('INFRA_DICTIONARY_ITEM_LBL_ROOT', '根节点'),
    description: '',
    sortIndex: 0,
    version: 0,
    createTime: '',
    updateTime: '',
    children: undefined,
  };
}

/** 编辑时从树中移除当前节点，避免选自己为父级 */
function filterTreeExcludingSelf(nodes: DictionaryItemTree[], selfId: number): DictionaryItemTree[] {
  return nodes.filter((n) => n.id !== selfId).map((n) => ({
      ...n, children: n.children && n.children.length > 0 ? filterTreeExcludingSelf(n.children, selfId) : undefined,
  }));
}

async function refreshParentTree() {
  if (props.dictionaryUsageCode == '') return;
  parentTreeLoading.value = true;
  try {
    const roots = await DictionaryItemApi.tree(props.dictionaryUsageCode);
    const top = createTopLevelTreeOption(props.dictionaryUsageCode);
    let merged: DictionaryItemTree[] = [top, ...roots];
    if (isEdit.value && editForm.id !== undefined && editForm.id > 0) {
      merged = filterTreeExcludingSelf(merged, editForm.id);
    }
    parentTreeData.value = merged;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : t('INFRA_DICTIONARY_ITEM_MSG_TREE_FAIL', '加载父级树失败');
    showErrorMessage(msg);
    parentTreeData.value = [createTopLevelTreeOption(props.dictionaryUsageCode)];
  } finally {
    parentTreeLoading.value = false;
  }
}

function resetQueryFields() {
  baseQueryForm.id = undefined;
  baseQueryForm.createTime = undefined;
  baseQueryForm.updateTime = undefined;
  baseQueryForm.sorts = undefined;
  queryForm.parentId = undefined as number | undefined;
  queryForm.code = '';
  queryForm.name = '';
}

watch(
  () => props.dictionaryUsageCode,
  (code) => {
    if (code != '') {
      resetQueryFields();
      pagination.pageNum = 1;
      loadData();
    }
  },
  { immediate: true },
);

watch(editDialogVisible, (open) => {
  if (open) {
    void refreshParentTree();
  }
});
</script>

<style scoped>
.dictionary-item-panel {
  padding: 0;
  min-height: 100%;
  box-sizing: border-box;
}

.dictionary-item-panel__search {
  margin-bottom: 12px;
  background-color: #fff;
}

.dictionary-item-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 4px;
}

.dictionary-item-panel__title-group h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.dictionary-item-panel__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
