/**
 * g2rain_raindrop相关 API 服务
 * 提供g2rain_raindrop数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { G2rainRaindrop, G2rainRaindropPayload, G2rainRaindropQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * g2rain_raindrop API 服务类
 */
export class G2rainRaindropApi {
  /**
   * 获取g2rain_raindrop列表
   * @param params 查询参数（可选）
   * @returns g2rain_raindrop列表
   */
  static async list(params?: G2rainRaindropQuery): Promise<G2rainRaindrop[]> {
    const http = getHttpClient('default');
    const res = await http.get<G2rainRaindrop[]>('/infra/g2rain_raindrop/list', params);
    return res.data || [];
  }

  /**
   * 分页查询g2rain_raindrop列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: G2rainRaindropQuery & PageSelectListDto): Promise<PageData<G2rainRaindrop>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<G2rainRaindrop>>('/infra/g2rain_raindrop/page', params);
    return res.data;
  }

  /**
   * 保存g2rain_raindrop（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload g2rain_raindrop数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的g2rain_raindrop
   */
  static async save(payload: G2rainRaindropPayload): Promise<G2rainRaindrop> {
    const http = getHttpClient('default');
    const res = await http.post<G2rainRaindrop>('/infra/g2rain_raindrop/save', payload);
    return res.data;
  }

  /**
   * 删除g2rain_raindrop
   * @param id g2rain_raindrop ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/infra/g2rain_raindrop/${id}`);
  }

  /**
   * 查询业务标签字典集合
   */
  static async bizTagDict(): Promise<string[]> {
    const http = getHttpClient('default');
    const res = await http.get<string[]>(`/infra/g2rain_raindrop/biz_tag_dict`);
    return res.data;
  }
}

