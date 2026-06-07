/**
 * locale_setting相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * locale_setting接口
 */
export interface LocaleSetting extends BaseVo {
  code: string;
  name: string;
  description: string;
  sortIndex: number;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface LocaleSettingPayload {
  id?: number; // 更新时传入 ID，新增时不传
  code?: string;
  name?: string;
  description?: string;
  sortIndex?: number;
}

/**
 * locale_setting查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface LocaleSettingQuery extends BaseSelectListDto {
  // 业务查询字段
  code?: string;
  name?: string;
}

