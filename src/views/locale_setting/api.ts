/**
 * locale_setting相关 API 服务
 * 提供locale_setting数据的 CRUD 操作接口
 */

import { getHttpClient } from '@/components/http';
import type { LocaleSetting, LocaleSettingPayload, LocaleSettingQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

/** 语言代码 → 该区域语言下可选的国家/区域代码列表（与后端语言地域映射接口 JSON 一致） */
export type LanguageCountriesMap = Record<string, string[]>;

/**
 * locale_setting API 服务类
 */
export class LocaleSettingApi {
  /**
   * 获取locale_setting列表
   * @param params 查询参数（可选）
   * @returns locale_setting列表
   */
  static async list(params?: LocaleSettingQuery): Promise<LocaleSetting[]> {
    const http = getHttpClient('default');
    const res = await http.get<LocaleSetting[]>('/infra/locale_setting/list', params);
    return res.data || [];
  }

  /**
   * 分页查询locale_setting列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: LocaleSettingQuery & PageSelectListDto): Promise<PageData<LocaleSetting>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<LocaleSetting>>('/infra/locale_setting/page', params);
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

  /**
   * 获取地域语言字典
   */
  static async localeDict(): Promise<string[]> {
    const http = getHttpClient('default');
    const res = await http.get<string[]>(`/infra/locale_setting/locale_dict`);
    return res.data;
  }

  /**
   * 获取语言地域映射（key 为 ISO 639 语言代码，value 为该语言下可用的 ISO 3166 国家/地区代码集合）
   */
  static async getLanguageCountries(): Promise<LanguageCountriesMap> {
    const http = getHttpClient('default');
    const res = await http.get<LanguageCountriesMap>(`/infra/locale_setting/get_language_countries`);
    return res.data ?? {};
  }
}

