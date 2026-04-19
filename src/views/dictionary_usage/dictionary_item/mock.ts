/**
 * dictionary_item相关 Mock 数据
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
 * 生成符合 DictionaryItem 类型的 Mock 数据模板
 */
function getDictionaryItemTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'parentId': '@integer(1, 100)',
            'dictionaryUsageId': '@integer(1, 100)',
            'code|1': ['@word(3,10)', '@word(3,10)'],
            'name|1': ['@word(3,10)', '@word(3,10)'],
            'description|1': ['@word(3,10)', '@word(3,10)'],
            'sortIndex': '@integer(1, 100)',
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * dictionary_item相关的 Mock 数据映射
 */
export const dictionaryItemMockDataMap: MockDataMap = {
  // GET /infra/dictionary_item - 根据条件查询列表
  '/infra/dictionary_item': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const parentId = query?.parentId;
    const dictionaryUsageId = query?.dictionaryUsageId;
    const code = query?.code;
    const name = query?.name;
    const description = query?.description;
    const sortIndex = query?.sortIndex;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getDictionaryItemTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (parentId) {
      filteredList = filteredList.filter((item: any) => {
                return item.parentId === parentId;
              });
    }
    if (dictionaryUsageId) {
      filteredList = filteredList.filter((item: any) => {
                return item.dictionaryUsageId === dictionaryUsageId;
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
    if (sortIndex) {
      filteredList = filteredList.filter((item: any) => {
                return item.sortIndex === sortIndex;
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/dictionary_item/list - 根据条件查询列表（兼容接口）
  '/infra/dictionary_item/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const parentId = query?.parentId;
    const dictionaryUsageId = query?.dictionaryUsageId;
    const code = query?.code;
    const name = query?.name;
    const description = query?.description;
    const sortIndex = query?.sortIndex;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getDictionaryItemTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (parentId) {
      filteredList = filteredList.filter((item: any) => {
                return item.parentId === parentId;
              });
    }
    if (dictionaryUsageId) {
      filteredList = filteredList.filter((item: any) => {
                return item.dictionaryUsageId === dictionaryUsageId;
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
    if (sortIndex) {
      filteredList = filteredList.filter((item: any) => {
                return item.sortIndex === sortIndex;
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/dictionary_item/tree - 树形列表（选父级）
  '/infra/dictionary_item/tree': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const dictionaryUsageId = Number(query?.dictionaryUsageId) || 1;

    const root1 = Mock.mock(
      getDictionaryItemTemplate({
        id: 1001,
        parentId: 0,
        dictionaryUsageId,
        code: 'root-a',
        name: '根节点 A',
        children: [],
      }),
    );
    const child1 = Mock.mock(
      getDictionaryItemTemplate({
        id: 1002,
        parentId: 1001,
        dictionaryUsageId,
        code: 'child-a1',
        name: '子节点 A-1',
        children: [],
      }),
    );
    root1.children = [child1];

    const root2 = Mock.mock(
      getDictionaryItemTemplate({
        id: 1003,
        parentId: 0,
        dictionaryUsageId,
        code: 'root-b',
        name: '根节点 B',
        children: [],
      }),
    );

    return createResult([root1, root2]);
  },

  // GET /infra/dictionary_item/page - 根据条件分页查询
  '/infra/dictionary_item/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const parentId = query?.query?.parentId || query?.parentId;
    const dictionaryUsageId = query?.query?.dictionaryUsageId || query?.dictionaryUsageId;
    const code = query?.query?.code || query?.code;
    const name = query?.query?.name || query?.name;
    const description = query?.query?.description || query?.description;
    const sortIndex = query?.query?.sortIndex || query?.sortIndex;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getDictionaryItemTemplate()],
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

  // POST /infra/dictionary_item/save - 保存（新增或更新）
  '/infra/dictionary_item/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的dictionary_item数据
    const dictionaryItemItem = Mock.mock(
      getDictionaryItemTemplate({
        id,
        parentId: payload.parentId !== undefined ? payload.parentId : '@integer(1, 100)',
        dictionaryUsageId: payload.dictionaryUsageId !== undefined ? payload.dictionaryUsageId : '@integer(1, 100)',
        code: payload.code !== undefined ? payload.code : '@word(3,10)',
        name: payload.name !== undefined ? payload.name : '@word(3,10)',
        description: payload.description !== undefined ? payload.description : '@word(3,10)',
        sortIndex: payload.sortIndex !== undefined ? payload.sortIndex : '@integer(1, 100)',
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(dictionaryItemItem);
  },

  // DELETE /infra/dictionary_item/:id - 删除
  '/infra/dictionary_item/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(dictionaryItemMockDataMap);
