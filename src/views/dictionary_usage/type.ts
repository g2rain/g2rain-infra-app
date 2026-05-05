/**
 * dictionary_usage相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * dictionary_usage接口
 */
export interface DictionaryUsage extends BaseVo {
  usageCode: string;
  usageName: string;
  description: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface DictionaryUsagePayload {
  id?: number; // 更新时传入 ID，新增时不传
  usageCode?: string;
  usageName?: string;
  description?: string;
}

/**
 * dictionary_usage查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface DictionaryUsageQuery extends BaseSelectListDto {
  // 业务查询字段
  usageCode?: string;
  usageName?: string;
}

