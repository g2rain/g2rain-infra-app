/**
 * dictionary_usage相关 API 服务
 * 提供dictionary_usage数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { DictionaryUsage, DictionaryUsagePayload, DictionaryUsageQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';
// 字典项 API 与 Mock（抽屉内使用，进入字典用途页即注册）
import './dictionary_item/api';

/**
 * dictionary_usage API 服务类
 */
export class DictionaryUsageApi {
  /**
   * 获取dictionary_usage列表
   * @param params 查询参数（可选）
   * @returns dictionary_usage列表
   */
  static async list(params?: { usageCode?: string; page?: number; size?: number }): Promise<DictionaryUsage[]> {
    const http = getHttpClient('default');
    const res = await http.get<DictionaryUsage[]>('/infra/dictionary_usage/list', params);
    return res.data || [];
  }

  /**
   * 分页查询dictionary_usage列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(
    params: DictionaryUsageQuery & PageSelectListDto,
  ): Promise<PageData<DictionaryUsage>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<DictionaryUsage>>('/infra/dictionary_usage/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id dictionary_usage ID
   * @returns dictionary_usage详情
   */
  static async getById(id: number): Promise<DictionaryUsage> {
    const http = getHttpClient('default');
    const res = await http.get<DictionaryUsage>(`/infra/dictionary_usage/${id}`);
    return res.data;
  }

  /**
   * 保存dictionary_usage（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload dictionary_usage数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的dictionary_usage
   */
  static async save(payload: DictionaryUsagePayload): Promise<DictionaryUsage> {
    const http = getHttpClient('default');
    const res = await http.post<DictionaryUsage>('/infra/dictionary_usage/save', payload);
    return res.data;
  }

  /**
   * 删除dictionary_usage
   * @param id dictionary_usage ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/infra/dictionary_usage/${id}`);
  }
}

