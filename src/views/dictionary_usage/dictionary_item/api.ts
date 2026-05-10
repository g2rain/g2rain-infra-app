/**
 * dictionary_item相关 API 服务
 * 提供dictionary_item数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { DictionaryItem, DictionaryItemPayload, DictionaryItemQuery, DictionaryItemTree } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/**
 * dictionary_item API 服务类
 */
export class DictionaryItemApi {
  /**
   * 获取dictionary_item列表
   * @param params 查询参数（可选）
   * @returns dictionary_item列表
   */
  static async list(params?: DictionaryItemQuery): Promise<DictionaryItem[]> {
    const http = getHttpClient('default');
    const res = await http.get<DictionaryItem[]>('/infra/dictionary_item/list', params);
    return res.data || [];
  }

  /**
   * 分页查询dictionary_item列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: DictionaryItemQuery & PageSelectListDto): Promise<PageData<DictionaryItem>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<DictionaryItem>>('/infra/dictionary_item/page', params);
    return res.data;
  }

  /**
   * 树形字典项列表（用于选择上级节点）
   */
  static async tree(usageCode: string): Promise<DictionaryItemTree[]> {
    const http = getHttpClient('default');
    const res = await http.get<DictionaryItemTree[]>('/infra/dictionary_item/tree', {
      usageCode,
    });
    return res.data || [];
  }

  /**
   * 保存dictionary_item（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload dictionary_item数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的dictionary_item
   */
  static async save(payload: DictionaryItemPayload): Promise<DictionaryItem> {
    const http = getHttpClient('default');
    const res = await http.post<DictionaryItem>('/infra/dictionary_item/save', payload);
    return res.data;
  }

  /**
   * 删除dictionary_item
   * @param id dictionary_item ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/infra/dictionary_item/${id}`);
  }
}
