/**
 * i18n_message_usage相关 API 服务
 * 提供i18n_message_usage数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { I18nMessageUsage, I18nMessageUsagePayload, I18nMessageUsageQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';

/**
 * i18n_message_usage API 服务类
 */
export class I18nMessageUsageApi {
  /**
   * 获取i18n_message_usage列表
   * @param params 查询参数（可选）
   * @returns i18n_message_usage列表
   */
  static async list(params?: { usageCode?: string; name?: string; page?: number; size?: number }): Promise<I18nMessageUsage[]> {
    const http = getHttpClient('default');
    const res = await http.get<I18nMessageUsage[]>('/infra/i18n_message_usage/list', params);
    return res.data || [];
  }

  /**
   * 分页查询i18n_message_usage列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(
    params: I18nMessageUsageQuery & PageSelectListDto,
  ): Promise<PageData<I18nMessageUsage>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<I18nMessageUsage>>('/infra/i18n_message_usage/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id i18n_message_usage ID
   * @returns i18n_message_usage详情
   */
  static async getById(id: number): Promise<I18nMessageUsage> {
    const http = getHttpClient('default');
    const res = await http.get<I18nMessageUsage>(`/infra/i18n_message_usage/${id}`);
    return res.data;
  }

  /**
   * 保存i18n_message_usage（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload i18n_message_usage数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的i18n_message_usage
   */
  static async save(payload: I18nMessageUsagePayload): Promise<I18nMessageUsage> {
    const http = getHttpClient('default');
    const res = await http.post<I18nMessageUsage>('/infra/i18n_message_usage/save', payload);
    return res.data;
  }

  /**
   * 删除i18n_message_usage
   * @param id i18n_message_usage ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/infra/i18n_message_usage/${id}`);
  }
}

