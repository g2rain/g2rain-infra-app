/**
 * locale_setting相关 Mock 数据
 */

import type { AxiosRequestConfig } from 'axios';
import type { MockDataMap } from '@/components/http/mock-data';
import type { Result } from '@/components/http/types';
import Mock from 'mockjs';
import { mockManager } from '@/components/http/mock-data';

/**
 * 生成符合 Result 格式的响应
 */
function createResult<T>(data: T, status: number = 200): Result<T> {
  // 先使用 Mock.mock 生成元数据，然后直接设置 data，避免 data 被 mock 处理
  const result = Mock.mock({
    requestId: '@guid',
    requestTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    status,
    errorCode: status === 200 ? '' : '@word(5,10)',
    errorMessage: status === 200 ? '' : '@cword(5,15)',
  }) as Result<T>;
  
  // 直接设置 data，不经过 Mock.mock 处理
  result.data = data;
  
  return result;
}

/**
 * 生成符合 LocaleSetting 类型的 Mock 数据模板
 */
function getLocaleSettingTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'languageCode|1': ['@word(3,10)', '@word(3,10)'],
            'regionCode|1': ['@word(3,10)', '@word(3,10)'],
            'code|1': ['@word(3,10)', '@word(3,10)'],
            'name|1': ['@word(3,10)', '@word(3,10)'],
            'description|1': ['@word(3,10)', '@word(3,10)'],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * locale_setting相关的 Mock 数据映射
 */
export const LocaleSettingMockDataMap: MockDataMap = {
  // GET /locale_setting - 根据条件查询列表
  '/locale_setting': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const languageCode = query?.languageCode;
    const regionCode = query?.regionCode;
    const code = query?.code;
    const name = query?.name;
    const description = query?.description;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getLocaleSettingTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (languageCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.languageCode && item.languageCode.includes(languageCode);
              });
    }
    if (regionCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.regionCode && item.regionCode.includes(regionCode);
              });
    }
    if (code) {
      filteredList = filteredList.filter((item: any) => {
                return item.code && item.code.includes(code);
              });
    }
    if (name) {
      filteredList = filteredList.filter((item: any) => {
                return item.name && item.name.includes(name);
              });
    }
    if (description) {
      filteredList = filteredList.filter((item: any) => {
                return item.description && item.description.includes(description);
              });
    }

    return createResult(filteredList);
  },

  // GET /locale_setting/list - 根据条件查询列表（兼容接口）
  '/locale_setting/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const languageCode = query?.languageCode;
    const regionCode = query?.regionCode;
    const code = query?.code;
    const name = query?.name;
    const description = query?.description;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getLocaleSettingTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (languageCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.languageCode && item.languageCode.includes(languageCode);
              });
    }
    if (regionCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.regionCode && item.regionCode.includes(regionCode);
              });
    }
    if (code) {
      filteredList = filteredList.filter((item: any) => {
                return item.code && item.code.includes(code);
              });
    }
    if (name) {
      filteredList = filteredList.filter((item: any) => {
                return item.name && item.name.includes(name);
              });
    }
    if (description) {
      filteredList = filteredList.filter((item: any) => {
                return item.description && item.description.includes(description);
              });
    }

    return createResult(filteredList);
  },

  // GET /locale_setting/page - 根据条件分页查询
  '/locale_setting/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const languageCode = query?.query?.languageCode || query?.languageCode;
    const regionCode = query?.query?.regionCode || query?.regionCode;
    const code = query?.query?.code || query?.code;
    const name = query?.query?.name || query?.name;
    const description = query?.query?.description || query?.description;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getLocaleSettingTemplate()],
    };

    const result = Mock.mock(template);

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);

    const pageData = {
      pageNum,
      pageSize,
      total,
      totalPages,
      records: result.records,
    };

    return createResult(pageData);
  },

  // POST /locale_setting/save - 保存（新增或更新）
  '/locale_setting/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的locale_setting数据
    const LocaleSettingItem = Mock.mock(
      getLocaleSettingTemplate({
        id,
        languageCode: payload.languageCode !== undefined ? payload.languageCode : '@word(3,10)',
        regionCode: payload.regionCode !== undefined ? payload.regionCode : '@word(3,10)',
        code: payload.code !== undefined ? payload.code : '@word(3,10)',
        name: payload.name !== undefined ? payload.name : '@word(3,10)',
        description: payload.description !== undefined ? payload.description : '@word(3,10)',
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(LocaleSettingItem);
  },

  // DELETE /locale_setting/:id - 删除
  '/locale_setting/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(LocaleSettingMockDataMap);

