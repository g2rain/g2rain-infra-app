/**
 * g2rain_raindrop相关 Mock 数据
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
 * 生成符合 G2rainRaindrop 类型的 Mock 数据模板
 */
function getG2rainRaindropTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'bizTag|1': ['@word(3,10)', '@word(3,10)'],
            'maxId': '@integer(1, 100)',
            'step': '@integer(1, 100)',
            'description|1': ['@word(3,10)', '@word(3,10)'],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * g2rain_raindrop相关的 Mock 数据映射
 */
export const g2rainRaindropMockDataMap: MockDataMap = {
  // GET /infra/g2rain_raindrop - 根据条件查询列表
  '/infra/g2rain_raindrop': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const bizTag = query?.bizTag;
    const maxId = query?.maxId;
    const step = query?.step;
    const description = query?.description;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getG2rainRaindropTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (bizTag) {
      filteredList = filteredList.filter((item: any) => {
                return item.bizTag && item.bizTag.includes(bizTag);
              });
    }
    if (maxId) {
      filteredList = filteredList.filter((item: any) => {
                return item.maxId === maxId;
              });
    }
    if (step) {
      filteredList = filteredList.filter((item: any) => {
                return item.step === step;
              });
    }
    if (description) {
      filteredList = filteredList.filter((item: any) => {
                return item.description && item.description.includes(description);
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/g2rain_raindrop/list - 根据条件查询列表（兼容接口）
  '/infra/g2rain_raindrop/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const bizTag = query?.bizTag;
    const maxId = query?.maxId;
    const step = query?.step;
    const description = query?.description;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getG2rainRaindropTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (bizTag) {
      filteredList = filteredList.filter((item: any) => {
                return item.bizTag && item.bizTag.includes(bizTag);
              });
    }
    if (maxId) {
      filteredList = filteredList.filter((item: any) => {
                return item.maxId === maxId;
              });
    }
    if (step) {
      filteredList = filteredList.filter((item: any) => {
                return item.step === step;
              });
    }
    if (description) {
      filteredList = filteredList.filter((item: any) => {
                return item.description && item.description.includes(description);
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/g2rain_raindrop/page - 根据条件分页查询
  '/infra/g2rain_raindrop/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const bizTag = query?.query?.bizTag || query?.bizTag;
    const maxId = query?.query?.maxId || query?.maxId;
    const step = query?.query?.step || query?.step;
    const description = query?.query?.description || query?.description;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getG2rainRaindropTemplate()],
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

  // POST /infra/g2rain_raindrop/save - 保存（新增或更新）
  '/infra/g2rain_raindrop/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的g2rain_raindrop数据
    const g2rainRaindropItem = Mock.mock(
      getG2rainRaindropTemplate({
        id,
        bizTag: payload.bizTag !== undefined ? payload.bizTag : '@word(3,10)',
        maxId: payload.maxId !== undefined ? payload.maxId : '@integer(1, 100)',
        step: payload.step !== undefined ? payload.step : '@integer(1, 100)',
        description: payload.description !== undefined ? payload.description : '@word(3,10)',
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(g2rainRaindropItem);
  },

  // DELETE /infra/g2rain_raindrop/:id - 删除
  '/infra/g2rain_raindrop/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(g2rainRaindropMockDataMap);

