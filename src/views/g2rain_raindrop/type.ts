/**
 * g2rain_raindrop相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * g2rain_raindrop接口
 */
export interface G2rainRaindrop extends BaseVo {
  bizTag: string;
  maxId: number;
  step: number;
  description: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface G2rainRaindropPayload {
  id?: number; // 更新时传入 ID，新增时不传
  bizTag?: string;
  maxId?: number;
  step?: number;
  description?: string;
}

/**
 * g2rain_raindrop查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface G2rainRaindropQuery extends BaseSelectListDto {
  // 业务查询字段
  bizTag?: string;
  maxId?: number;
  step?: number;
}
