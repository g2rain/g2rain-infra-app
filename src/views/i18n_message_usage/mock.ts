/**
 * i18n_message_usage相关 Mock 数据
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
 * 生成符合 I18nMessageUsage 类型的 Mock 数据模板
 */
function getI18nMessageUsageTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'usageCode|1': ['@word(3,10)', '@word(3,10)'],
            'name|1': ['@word(3,10)', '@word(3,10)'],
            'remark|1': ['@word(3,10)', '@word(3,10)'],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * i18n_message_usage相关的 Mock 数据映射
 */
export const I18nMessageUsageMockDataMap: MockDataMap = {
  // GET /infra/i18n_message_usage - 根据条件查询列表
  '/infra/i18n_message_usage': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const usageCode = query?.usageCode;
    const name = query?.name;
    const remark = query?.remark;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getI18nMessageUsageTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (usageCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.usageCode && item.usageCode.includes(usageCode);
              });
    }
    if (name) {
      filteredList = filteredList.filter((item: any) => {
                return item.name && item.name.includes(name);
              });
    }
    if (remark) {
      filteredList = filteredList.filter((item: any) => {
                return item.remark && item.remark.includes(remark);
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/i18n_message_usage/list - 根据条件查询列表（兼容接口）
  '/infra/i18n_message_usage/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const usageCode = query?.usageCode;
    const name = query?.name;
    const remark = query?.remark;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getI18nMessageUsageTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (usageCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.usageCode && item.usageCode.includes(usageCode);
              });
    }
    if (name) {
      filteredList = filteredList.filter((item: any) => {
                return item.name && item.name.includes(name);
              });
    }
    if (remark) {
      filteredList = filteredList.filter((item: any) => {
                return item.remark && item.remark.includes(remark);
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/i18n_message_usage/page - 根据条件分页查询
  '/infra/i18n_message_usage/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const usageCode = query?.query?.usageCode || query?.usageCode;
    const name = query?.query?.name || query?.name;
    const remark = query?.query?.remark || query?.remark;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getI18nMessageUsageTemplate()],
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

  // POST /infra/i18n_message_usage/save - 保存（新增或更新）
  '/infra/i18n_message_usage/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的i18n_message_usage数据
    const I18nMessageUsageItem = Mock.mock(
      getI18nMessageUsageTemplate({
        id,
        usageCode: payload.usageCode !== undefined ? payload.usageCode : '@word(3,10)',
        name: payload.name !== undefined ? payload.name : '@word(3,10)',
        remark: payload.remark !== undefined ? payload.remark : '@word(3,10)',
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(I18nMessageUsageItem);
  },

  // DELETE /infra/i18n_message_usage/:id - 删除
  '/infra/i18n_message_usage/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(I18nMessageUsageMockDataMap);

