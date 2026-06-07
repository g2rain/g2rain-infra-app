/**
 * 视图路由映射
 * 仅注册「模板内已有」的示例页面，不包含具体业务系统的页面。
 * 从本模板生成新项目后，在此补充 views 下的页面与 linkPath 的映射即可。
 */

import type { RouteRecordRaw } from 'vue-router';
import { t } from '@platform/i18n';

export interface ViewRouteConfig {
  component: () => Promise<unknown>;
  name?: string;
  meta: {
    titleKey: string;
    titleDefault: string;
    requiresAuth: boolean;
    showInHome?: boolean;
  };
}

function resolveRouteTitle(meta: ViewRouteConfig['meta']): string {
  return t(meta.titleKey, meta.titleDefault);
}

/** 路由路径 -> 视图配置
 * 模板默认不包含任何「system」示例页面。
 * 你可以在子应用生成后按需补充 `views/*` 并在这里注册。
 */
export const routeMap: Record<string, ViewRouteConfig> = {
  '/g2rain_raindrop': {
    component: () => import('@/views/g2rain_raindrop/index.vue'),
    name: 'G2rainRaindrop',
    meta: {
      titleKey: 'INFRA_ROUTE_G2RAIN_RAINDROP',
      titleDefault: '发号器',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/dictionary_usage': {
    component: () => import('@/views/dictionary_usage/index.vue'),
    name: 'DictionaryUsage',
    meta: {
      titleKey: 'INFRA_ROUTE_DICTIONARY_USAGE',
      titleDefault: '字典用途',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/locale_setting': {
    component: () => import('@/views/locale_setting/index.vue'),
    name: 'LocaleSetting',
    meta: {
      titleKey: 'INFRA_ROUTE_LOCALE_SETTING',
      titleDefault: '地区语言',
      requiresAuth: true,
      showInHome: true,
    },
  },
  '/i18n_message': {
    component: () => import('@/views/i18n_message/index.vue'),
    name: 'I18nMessage',
    meta: {
      titleKey: 'INFRA_ROUTE_I18N_MESSAGE',
      titleDefault: '国际化信息',
      requiresAuth: true,
      showInHome: true,
    },
  },
};

export function getRouteConfig(): RouteRecordRaw[] {
  return Object.entries(routeMap).map(([path, config]) => {
    const { component, name, meta } = config;
    return {
      path,
      name,
      component,
      meta: {
        ...meta,
        title: resolveRouteTitle(meta),
      },
    } as RouteRecordRaw;
  });
}

export function getRouteComponent(routePath: string): (() => Promise<unknown>) | undefined {
  return routeMap[routePath]?.component;
}

export function getHomeRoutes(): Array<{ path: string; title: string; name?: string }> {
  return Object.entries(routeMap)
    .filter(([path, config]) => {
      if (path === '/' || path === '/home') {
        return false;
      }
      return config.meta.showInHome === true;
    })
    .map(([path, config]) => ({
      path,
      title: resolveRouteTitle(config.meta),
      name: config.name,
    }));
}
