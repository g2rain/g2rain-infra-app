<template>
  <div class="dictionary-item-panel">
    <el-card class="dictionary-item-panel__search" shadow="never">
      <QueryForm
        ref="queryFormRef"
        v-model="baseQueryForm"
        @search="handleSearch"
      >
        <el-form-item label="上级节点">
          <el-input v-model="queryForm.parentId" placeholder="请输入上级节点" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="queryForm.code" placeholder="请输入编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="queryForm.name" placeholder="请输入名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="queryForm.description" placeholder="请输入描述" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="queryForm.sortIndex" placeholder="请输入排序" clearable style="width: 200px" />
        </el-form-item>

        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <div class="dictionary-item-panel__header">
      <div class="dictionary-item-panel__title-group">
        <h3>字典项（用途 ID：{{ dictionaryUsageId }}）</h3>
      </div>
      <el-button type="primary" v-permission="'dictionary_item:add'" @click="handleCreate">
        新增 dictionary_item
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
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="parentName" label="上级节点" width="140">
        <template #default="{ row }">
          {{ row.parentName || '根节点' }}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="编码" width="180" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="description" label="描述" width="180" />
      <el-table-column prop="sortIndex" label="排序" width="140" />
      <TableColumn prop="createTime" label="创建时间" width="180" :sortable="true" />
      <TableColumn prop="updateTime" label="更新时间" width="180" :sortable="true" />
      <el-table-column label="操作" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">
            明细
          </el-button>
          <el-button
            type="primary"
            v-permission="'dictionary_item:edit'"
            link
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            v-permission="'dictionary_item:delete'"
            link
            size="small"
            @click="handleDelete(row)"
          >
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

    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑 dictionary_item' : '新增 dictionary_item'"
      width="520px"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item label="上级节点" prop="parentId">
          <el-tree-select
            v-model="editParentIdForTree"
            :data="parentTreeData"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            check-strictly
            clearable
            filterable
            default-expand-all
            :loading="parentTreeLoading"
            placeholder="请选择上级节点"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="editForm.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="排序" prop="sortIndex">
          <el-input v-model="editForm.sortIndex" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="dictionary_item 明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="上级节点">{{ currentRow?.parentName }}</el-descriptions-item>
        <el-descriptions-item label="编码">{{ currentRow?.code }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ currentRow?.name }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ currentRow?.description }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ currentRow?.sortIndex }}</el-descriptions-item>
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
import { ref, reactive, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { DictionaryItemApi } from '@/views/dictionary_usage/dictionary_item/api';
import type {
  DictionaryItem,
  DictionaryItemPayload,
  DictionaryItemQuery,
  DictionaryItemTree,
} from '@/views/dictionary_usage/dictionary_item/type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import type { QueryFormData } from '@/components/QueryForm';
import { SortableTable, TableColumn, SortManagerButton, QueryForm, showErrorMessage } from '@/components';

const props = defineProps<{
  dictionaryUsageId: number;
}>();

const tableData = ref<DictionaryItem[]>([]);

let baseQueryForm = reactive<QueryFormData>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

const queryForm = reactive({
  parentId: '',
  code: '',
  name: '',
  description: '',
  sortIndex: '',
});

const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const editDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const isEdit = ref(false);
const currentRow = ref<DictionaryItem | null>(null);
const editFormRef = ref<FormInstance | null>(null);

const parentTreeData = ref<DictionaryItemTree[]>([]);
const parentTreeLoading = ref(false);

/** 与 el-tree-select 的 v-model（number | undefined）同步到 editForm.parentId 字符串 */
const editParentIdForTree = computed<number | undefined>({
  get() {
    const s = editForm.parentId;
    if (s === '' || s == null) return undefined;
    const n = Number(s);
    return Number.isNaN(n) ? undefined : n;
  },
  set(v: number | string | null | undefined) {
    if (v === null || v === undefined || v === '') {
      editForm.parentId = '';
      return;
    }
    editForm.parentId = String(Number(v));
  },
});

function createTopLevelTreeOption(dictionaryUsageId: number): DictionaryItemTree {
  return {
    id: 0,
    parentId: 0,
    dictionaryUsageId,
    code: '',
    name: '根节点',
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
  return nodes
    .filter((n) => n.id !== selfId)
    .map((n) => ({
      ...n,
      children:
        n.children && n.children.length > 0 ? filterTreeExcludingSelf(n.children, selfId) : undefined,
    }));
}

async function refreshParentTree() {
  if (props.dictionaryUsageId <= 0) return;
  parentTreeLoading.value = true;
  try {
    const roots = await DictionaryItemApi.tree(props.dictionaryUsageId);
    const top = createTopLevelTreeOption(props.dictionaryUsageId);
    let merged: DictionaryItemTree[] = [top, ...roots];
    if (isEdit.value && editForm.id > 0) {
      merged = filterTreeExcludingSelf(merged, editForm.id);
    }
    parentTreeData.value = merged;
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error : typeof error === 'string' ? error : '加载父级树失败');
    parentTreeData.value = [createTopLevelTreeOption(props.dictionaryUsageId)];
  } finally {
    parentTreeLoading.value = false;
  }
}

const editForm = reactive({
  id: 0,
  parentId: '',
  code: '',
  name: '',
  description: '',
  sortIndex: '',
});

const editRules: FormRules = {
  parentId: [{ required: true, message: '请选择上级节点', trigger: ['change', 'blur'] }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  sortIndex: [{ required: true, message: '请输入排序', trigger: 'blur' }],
};

function resetQueryFields() {
  baseQueryForm.id = undefined;
  baseQueryForm.createTime = undefined;
  baseQueryForm.updateTime = undefined;
  baseQueryForm.sorts = undefined;
  queryForm.parentId = '';
  queryForm.code = '';
  queryForm.name = '';
  queryForm.description = '';
  queryForm.sortIndex = '';
}

const handleCreate = () => {
  isEdit.value = false;
  editForm.parentId = '0';
  editForm.code = '';
  editForm.name = '';
  editForm.description = '';
  editForm.sortIndex = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: DictionaryItem) => {
  isEdit.value = true;
  editForm.id = row.id;
  editForm.parentId = String(row.parentId ?? 0);
  editForm.code = row.code;
  editForm.name = row.name;
  editForm.description = row.description;
  editForm.sortIndex = String(row.sortIndex);
  editDialogVisible.value = true;
};

const handleView = (row: DictionaryItem) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const handleDelete = (row: DictionaryItem) => {
  ElMessageBox.confirm(`确认删除 dictionary_item「${row.id}」吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      try {
        await DictionaryItemApi.remove(row.id);
        if (tableData.value.length === 1 && pagination.pageNum > 1) {
          pagination.pageNum--;
        }
        await loadData();
        ElMessage.success('删除成功');
      } catch (error: unknown) {
        showErrorMessage(error instanceof Error ? error : typeof error === 'string' ? error : '删除失败');
      }
    })
    .catch(() => {});
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: DictionaryItemPayload = {
    parentId: editForm.parentId as unknown as DictionaryItemPayload['parentId'],
    dictionaryUsageId: props.dictionaryUsageId,
    code: editForm.code,
    name: editForm.name,
    description: editForm.description,
    sortIndex: editForm.sortIndex as unknown as DictionaryItemPayload['sortIndex'],
  };

  try {
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await DictionaryItemApi.save(payload);
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
    await loadData();
    editDialogVisible.value = false;
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error : typeof error === 'string' ? error : '保存失败');
  }
};

const handleSortChange = (params: Record<string, string>) => {
  if (queryFormRef.value) {
    queryFormRef.value.updateSorts(params);
  }
};

const loadData = async () => {
  try {
    const filteredBase = Object.fromEntries(
      Object.entries(baseQueryForm).filter(
        ([_, v]) => v != null && (!Array.isArray(v) || v.length > 0),
      ),
    ) as Partial<BaseSelectListDto> & Partial<QueryFormData>;

    const query: DictionaryItemQuery = {
      ...filteredBase,
      dictionaryUsageId: props.dictionaryUsageId,
      ...(queryForm.parentId ? { parentId: queryForm.parentId as unknown as number } : {}),
      ...(queryForm.code ? { code: queryForm.code } : {}),
      ...(queryForm.name ? { name: queryForm.name } : {}),
      ...(queryForm.description ? { description: queryForm.description } : {}),
      ...(queryForm.sortIndex ? { sortIndex: queryForm.sortIndex as unknown as number } : {}),
    };

    const params: DictionaryItemQuery & PageSelectListDto = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    };

    const pageData = await DictionaryItemApi.page(params);
    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error : typeof error === 'string' ? error : '加载列表失败');
  }
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

const handleReset = () => {
  resetQueryFields();
  pagination.pageNum = 1;
  loadData();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  loadData();
};

const handlePageChange = (page: number) => {
  pagination.pageNum = page;
  loadData();
};

watch(
  () => props.dictionaryUsageId,
  (id) => {
    if (id > 0) {
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
