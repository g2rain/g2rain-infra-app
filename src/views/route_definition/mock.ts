/**
 * route_definition相关 Mock 数据
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
 * 生成符合 RouteDefinition 类型的 Mock 数据模板
 */
function getRouteDefinitionTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'name|1': ['@word(3,10)', '@word(3,10)'],
            'endpointHost|1': ['@word(3,10)', '@word(3,10)'],
            'endpointPath|1': ['@word(3,10)', '@word(3,10)'],
            'context|1': ['@word(3,10)', '@word(3,10)'],
            'path|1': ['@word(3,10)', '@word(3,10)'],
            'method|1': ['@word(3,10)', '@word(3,10)'],
            'headerParameters|1': ['@word(3,10)', '@word(3,10)'],
            'contentType|1': ['@word(3,10)', '@word(3,10)'],
            'description|1': ['@word(3,10)', '@word(3,10)'],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * route_definition相关的 Mock 数据映射
 */
export const routeDefinitionMockDataMap: MockDataMap = {
  // GET /infra/route_definition - 根据条件查询列表
  '/infra/route_definition': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const name = query?.name;
    const endpointHost = query?.endpointHost;
    const endpointPath = query?.endpointPath;
    const context = query?.context;
    const path = query?.path;
    const method = query?.method;
    const headerParameters = query?.headerParameters;
    const contentType = query?.contentType;
    const description = query?.description;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getRouteDefinitionTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (name) {
      filteredList = filteredList.filter((item: any) => {
                return item.name && item.name.includes(name);
              });
    }
    if (endpointHost) {
      filteredList = filteredList.filter((item: any) => {
                return item.endpointHost && item.endpointHost.includes(endpointHost);
              });
    }
    if (endpointPath) {
      filteredList = filteredList.filter((item: any) => {
                return item.endpointPath && item.endpointPath.includes(endpointPath);
              });
    }
    if (context) {
      filteredList = filteredList.filter((item: any) => {
                return item.context && item.context.includes(context);
              });
    }
    if (path) {
      filteredList = filteredList.filter((item: any) => {
                return item.path && item.path.includes(path);
              });
    }
    if (method) {
      filteredList = filteredList.filter((item: any) => {
                return item.method && item.method.includes(method);
              });
    }
    if (headerParameters) {
      filteredList = filteredList.filter((item: any) => {
                return item.headerParameters && item.headerParameters.includes(headerParameters);
              });
    }
    if (contentType) {
      filteredList = filteredList.filter((item: any) => {
                return item.contentType && item.contentType.includes(contentType);
              });
    }
    if (description) {
      filteredList = filteredList.filter((item: any) => {
                return item.description && item.description.includes(description);
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/route_definition/list - 根据条件查询列表（兼容接口）
  '/infra/route_definition/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const name = query?.name;
    const endpointHost = query?.endpointHost;
    const endpointPath = query?.endpointPath;
    const context = query?.context;
    const path = query?.path;
    const method = query?.method;
    const headerParameters = query?.headerParameters;
    const contentType = query?.contentType;
    const description = query?.description;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getRouteDefinitionTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (name) {
      filteredList = filteredList.filter((item: any) => {
                return item.name && item.name.includes(name);
              });
    }
    if (endpointHost) {
      filteredList = filteredList.filter((item: any) => {
                return item.endpointHost && item.endpointHost.includes(endpointHost);
              });
    }
    if (endpointPath) {
      filteredList = filteredList.filter((item: any) => {
                return item.endpointPath && item.endpointPath.includes(endpointPath);
              });
    }
    if (context) {
      filteredList = filteredList.filter((item: any) => {
                return item.context && item.context.includes(context);
              });
    }
    if (path) {
      filteredList = filteredList.filter((item: any) => {
                return item.path && item.path.includes(path);
              });
    }
    if (method) {
      filteredList = filteredList.filter((item: any) => {
                return item.method && item.method.includes(method);
              });
    }
    if (headerParameters) {
      filteredList = filteredList.filter((item: any) => {
                return item.headerParameters && item.headerParameters.includes(headerParameters);
              });
    }
    if (contentType) {
      filteredList = filteredList.filter((item: any) => {
                return item.contentType && item.contentType.includes(contentType);
              });
    }
    if (description) {
      filteredList = filteredList.filter((item: any) => {
                return item.description && item.description.includes(description);
              });
    }

    return createResult(filteredList);
  },

  // GET /infra/route_definition/page - 根据条件分页查询
  '/infra/route_definition/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const name = query?.query?.name || query?.name;
    const endpointHost = query?.query?.endpointHost || query?.endpointHost;
    const endpointPath = query?.query?.endpointPath || query?.endpointPath;
    const context = query?.query?.context || query?.context;
    const path = query?.query?.path || query?.path;
    const method = query?.query?.method || query?.method;
    const headerParameters = query?.query?.headerParameters || query?.headerParameters;
    const contentType = query?.query?.contentType || query?.contentType;
    const description = query?.query?.description || query?.description;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getRouteDefinitionTemplate()],
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

  // POST /infra/route_definition/save - 保存（新增或更新）
  '/infra/route_definition/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的route_definition数据
    const routeDefinitionItem = Mock.mock(
      getRouteDefinitionTemplate({
        id,
        name: payload.name !== undefined ? payload.name : '@word(3,10)',
        endpointHost: payload.endpointHost !== undefined ? payload.endpointHost : '@word(3,10)',
        endpointPath: payload.endpointPath !== undefined ? payload.endpointPath : '@word(3,10)',
        context: payload.context !== undefined ? payload.context : '@word(3,10)',
        path: payload.path !== undefined ? payload.path : '@word(3,10)',
        method: payload.method !== undefined ? payload.method : '@word(3,10)',
        headerParameters: payload.headerParameters !== undefined ? payload.headerParameters : '@word(3,10)',
        contentType: payload.contentType !== undefined ? payload.contentType : '@word(3,10)',
        description: payload.description !== undefined ? payload.description : '@word(3,10)',
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(routeDefinitionItem);
  },

  // DELETE /infra/route_definition/:id - 删除
  '/infra/route_definition/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(routeDefinitionMockDataMap);

