/**
 * i18n_message相关 Mock 数据
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
 * 生成符合 I18nMessage 类型的 Mock 数据模板
 */
function getI18nMessageTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'messageUsageId': '@integer(1, 100)',
            'languageCode|1': ['@word(3,10)', '@word(3,10)'],
            'regionCode|1': ['@word(3,10)', '@word(3,10)'],
            'messageCode|1': ['@word(3,10)', '@word(3,10)'],
            'messageText|1': ['@word(3,10)', '@word(3,10)'],
            'extendField|1': ['@word(3,10)', '@word(3,10)'],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * i18n_message相关的 Mock 数据映射
 */
export const I18nMessageMockDataMap: MockDataMap = {
  // GET /infra/i18n_message - 根据条件查询列表
  '/infra/i18n_message': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const messageUsageId = query?.messageUsageId;
    const languageCode = query?.languageCode;
    const regionCode = query?.regionCode;
    const messageCode = query?.messageCode;
    const messageText = query?.messageText;
    const extendField = query?.extendField;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getI18nMessageTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (messageUsageId) {
      filteredList = filteredList.filter((item: any) => {
                return item.messageUsageId === messageUsageId;
              });
    }
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
    if (messageCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.messageCode && item.messageCode.includes(messageCode);
              });
    }
    if (messageText) {
      filteredList = filteredList.filter((item: any) => {
                return item.messageText && item.messageText.includes(messageText);
              });
    }
    if (extendField) {
      filteredList = filteredList.filter((item: any) => {
                return item.extendField && item.extendField.includes(extendField);
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/i18n_message/list - 根据条件查询列表（兼容接口）
  '/infra/i18n_message/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const messageUsageId = query?.messageUsageId;
    const languageCode = query?.languageCode;
    const regionCode = query?.regionCode;
    const messageCode = query?.messageCode;
    const messageText = query?.messageText;
    const extendField = query?.extendField;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getI18nMessageTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (messageUsageId) {
      filteredList = filteredList.filter((item: any) => {
                return item.messageUsageId === messageUsageId;
              });
    }
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
    if (messageCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.messageCode && item.messageCode.includes(messageCode);
              });
    }
    if (messageText) {
      filteredList = filteredList.filter((item: any) => {
                return item.messageText && item.messageText.includes(messageText);
              });
    }
    if (extendField) {
      filteredList = filteredList.filter((item: any) => {
                return item.extendField && item.extendField.includes(extendField);
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/i18n_message/page - 根据条件分页查询
  '/infra/i18n_message/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const messageUsageId = query?.query?.messageUsageId || query?.messageUsageId;
    const languageCode = query?.query?.languageCode || query?.languageCode;
    const regionCode = query?.query?.regionCode || query?.regionCode;
    const messageCode = query?.query?.messageCode || query?.messageCode;
    const messageText = query?.query?.messageText || query?.messageText;
    const extendField = query?.query?.extendField || query?.extendField;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getI18nMessageTemplate()],
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

  // POST /infra/i18n_message/save - 保存（新增或更新）
  '/infra/i18n_message/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的i18n_message数据
    const I18nMessageItem = Mock.mock(
      getI18nMessageTemplate({
        id,
        messageUsageId: payload.messageUsageId !== undefined ? payload.messageUsageId : '@integer(1, 100)',
        languageCode: payload.languageCode !== undefined ? payload.languageCode : '@word(3,10)',
        regionCode: payload.regionCode !== undefined ? payload.regionCode : '@word(3,10)',
        messageCode: payload.messageCode !== undefined ? payload.messageCode : '@word(3,10)',
        messageText: payload.messageText !== undefined ? payload.messageText : '@word(3,10)',
        extendField: payload.extendField !== undefined ? payload.extendField : '@word(3,10)',
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(I18nMessageItem);
  },

  // DELETE /infra/i18n_message/:id - 删除
  '/infra/i18n_message/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(I18nMessageMockDataMap);

