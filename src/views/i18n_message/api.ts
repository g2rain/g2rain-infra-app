/**
 * i18n_message相关 API 服务
 * 提供i18n_message数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { I18nMessage, I18nMessagePayload, I18nMessageQuery, I18nMsgUsage } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * i18n_message API 服务类
 */
export class I18nMessageApi {
  /**
   * 获取i18n_message列表
   * @param params 查询参数（可选）
   * @returns i18n_message列表
   */
  static async list(params?: I18nMessageQuery): Promise<I18nMessage[]> {
    const http = getHttpClient('default');
    const res = await http.get<I18nMessage[]>('/infra/i18n_message/list', params);
    return res.data || [];
  }

  /**
   * 分页查询i18n_message列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: I18nMessageQuery & PageSelectListDto): Promise<PageData<I18nMessage>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<I18nMessage>>('/infra/i18n_message/page', params);
    return res.data;
  }

  /**
   * 保存i18n_message（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload i18n_message数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的i18n_message
   */
  static async save(payload: I18nMessagePayload): Promise<I18nMessage> {
    const http = getHttpClient('default');
    const res = await http.post<I18nMessage>('/infra/i18n_message/save', payload);
    return res.data;
  }

  /**
   * 删除i18n_message
   * @param id i18n_message ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/infra/i18n_message/${id}`);
  }

  /**
   * 获取国际化用途集合
   */
  static async i18nMessageUsages(): Promise<I18nMsgUsage[]> {
    const http = getHttpClient('default');
    const res = await http.get<I18nMsgUsage[]>(`/infra/i18n_message/i18n_message_usages`);
    return res.data;
  }
}

