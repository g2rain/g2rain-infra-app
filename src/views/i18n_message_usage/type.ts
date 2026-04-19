/**
 * i18n_message_usage相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * i18n_message_usage接口
 */
export interface I18nMessageUsage extends BaseVo {
  usageCode: string;
  name: string;
  remark: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface I18nMessageUsagePayload {
  id?: number; // 更新时传入 ID，新增时不传
  usageCode?: string;
  name?: string;
  remark?: string;
}

/**
 * i18n_message_usage查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface I18nMessageUsageQuery extends BaseSelectListDto {
  // 业务查询字段
  usageCode?: string;
  name?: string;
  remark?: string;
}

