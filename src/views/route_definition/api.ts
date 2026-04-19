/**
 * route_definition相关 API 服务
 * 提供route_definition数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { RouteDefinition, RouteDefinitionPayload, RouteDefinitionQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';

/**
 * route_definition API 服务类
 */
export class RouteDefinitionApi {
  /**
   * 获取route_definition列表
   * @param params 查询参数（可选）
   * @returns route_definition列表
   */
  static async list(params?: { name?: string; page?: number; size?: number }): Promise<RouteDefinition[]> {
    const http = getHttpClient('default');
    const res = await http.get<RouteDefinition[]>('/infra/route_definition/list', params);
    return res.data || [];
  }

  /**
   * 分页查询route_definition列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(
    params: RouteDefinitionQuery & PageSelectListDto,
  ): Promise<PageData<RouteDefinition>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<RouteDefinition>>('/infra/route_definition/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id route_definition ID
   * @returns route_definition详情
   */
  static async getById(id: number): Promise<RouteDefinition> {
    const http = getHttpClient('default');
    const res = await http.get<RouteDefinition>(`/infra/route_definition/${id}`);
    return res.data;
  }

  /**
   * 保存route_definition（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload route_definition数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的route_definition
   */
  static async save(payload: RouteDefinitionPayload): Promise<RouteDefinition> {
    const http = getHttpClient('default');
    const res = await http.post<RouteDefinition>('/infra/route_definition/save', payload);
    return res.data;
  }

  /**
   * 删除route_definition
   * @param id route_definition ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/infra/route_definition/${id}`);
  }
}

