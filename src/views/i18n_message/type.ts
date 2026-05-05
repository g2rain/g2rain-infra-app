/**
 * i18n_message相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * i18n_message接口
 */
export interface I18nMessage extends BaseVo {
  messageUsageCode: string;
  languageCode: string;
  regionCode: string;
  messageCode: string;
  messageText: string;
  extendField: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface I18nMessagePayload {
  id?: number; // 更新时传入 ID，新增时不传
  messageUsageCode?: string;
  languageCode?: string;
  regionCode?: string;
  messageCode?: string;
  messageText?: string;
  extendField?: string;
}

/**
 * i18n_message查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface I18nMessageQuery extends BaseSelectListDto {
  // 业务查询字段
  messageUsageCode?: string;
  languageCode?: string;
  regionCode?: string;
  messageCode?: string;
}

export interface I18nMsgUsage extends BaseVo {
  code: string;
  name: string;
}