/**
 * route_definition相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * route_definition接口
 */
export interface RouteDefinition extends BaseVo {
  name: string;
  endpointHost: string;
  endpointPath: string;
  context: string;
  path: string;
  method: string;
  headerParameters: string;
  contentType: string;
  description: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface RouteDefinitionPayload {
  id?: number; // 更新时传入 ID，新增时不传
  name?: string;
  endpointHost?: string;
  endpointPath?: string;
  context?: string;
  path?: string;
  method?: string;
  headerParameters?: string;
  contentType?: string;
  description?: string;
}

/**
 * route_definition查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface RouteDefinitionQuery extends BaseSelectListDto {
  // 业务查询字段
  name?: string;
  endpointHost?: string;
  endpointPath?: string;
  context?: string;
  path?: string;
  method?: string;
  headerParameters?: string;
  contentType?: string;
  description?: string;
}

