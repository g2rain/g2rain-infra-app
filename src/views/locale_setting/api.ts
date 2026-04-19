/**
 * locale_setting相关 API 服务
 * 提供locale_setting数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { LocaleSetting, LocaleSettingPayload, LocaleSettingQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';

/**
 * locale_setting API 服务类
 */
export class LocaleSettingApi {
  /**
   * 获取locale_setting列表
   * @param params 查询参数（可选）
   * @returns locale_setting列表
   */
  static async list(params?: { languageCode?: string; page?: number; size?: number }): Promise<LocaleSetting[]> {
    const http = getHttpClient('default');
    const res = await http.get<LocaleSetting[]>('/infra/locale_setting/list', params);
    return res.data || [];
  }

  /**
   * 分页查询locale_setting列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(
    params: LocaleSettingQuery & PageSelectListDto,
  ): Promise<PageData<LocaleSetting>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<LocaleSetting>>('/infra/locale_setting/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id locale_setting ID
   * @returns locale_setting详情
   */
  static async getById(id: number): Promise<LocaleSetting> {
    const http = getHttpClient('default');
    const res = await http.get<LocaleSetting>(`/infra/locale_setting/${id}`);
    return res.data;
  }

  /**
   * 保存locale_setting（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload locale_setting数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的locale_setting
   */
  static async save(payload: LocaleSettingPayload): Promise<LocaleSetting> {
    const http = getHttpClient('default');
    const res = await http.post<LocaleSetting>('/infra/locale_setting/save', payload);
    return res.data;
  }

  /**
   * 删除locale_setting
   * @param id locale_setting ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/infra/locale_setting/${id}`);
  }
}

