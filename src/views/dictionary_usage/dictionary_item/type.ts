/**
 * dictionary_item相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * dictionary_item接口
 */
export interface DictionaryItem extends BaseVo {
  parentId: number;
  parentName?: string;
  dictionaryUsageId: number;
  code: string;
  name: string;
  description: string;
  sortIndex: number;
}

/**
 * 字典项树节点（与后端 DictionaryItemTreeVo 对齐）
 */
export interface DictionaryItemTree extends DictionaryItem {
  children?: DictionaryItemTree[];
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DictionaryItemPayload {
  id?: number; // 更新时传入 ID，新增时不传
  parentId?: number;
  dictionaryUsageId?: number;
  code?: string;
  name?: string;
  description?: string;
  sortIndex?: number;
}

/**
 * dictionary_item查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface DictionaryItemQuery extends BaseSelectListDto {
  // 业务查询字段
  parentId?: number;
  dictionaryUsageId?: number;
  code?: string;
  name?: string;
  description?: string;
  sortIndex?: number;
}
