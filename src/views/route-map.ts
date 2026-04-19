/**
 * 视图路由映射（模板项目）
 *
 * 仅注册「模板内已有」的示例页面，不包含具体业务系统的页面。
 * 从本模板生成新项目后，在此补充 views 下的页面与 linkPath 的映射即可。
 */

export interface ViewRouteConfig {
  component: () => Promise<unknown>;
  name?: string;
  meta: {
    title: string;
    requiresAuth: boolean;
    showInHome?: boolean;
  };
}

/** 路由路径 -> 视图配置
 * 模板默认不包含任何「system」示例页面。
 * 你可以在子应用生成后按需补充 `views/*` 并在这里注册。
 */
export const routeMap: Record<string, ViewRouteConfig> = {
    '/g2rain_raindrop': {
            component: () => import('@/views/g2rain_raindrop/index.vue'),
            name: 'G2rainRaindrop',
            meta: { title: 'g2rain_raindrop', requiresAuth: true, showInHome: true },
        },
    '/dictionary_usage': {
            component: () => import('@/views/dictionary_usage/index.vue'),
            name: 'DictionaryUsage',
            meta: { title: 'dictionary_usage', requiresAuth: true, showInHome: true },
        },
    '/route_definition': {
            component: () => import('@/views/route_definition/index.vue'),
            name: 'RouteDefinition',
            meta: { title: 'route_definition', requiresAuth: true, showInHome: true },
        },
    '/locale_setting': {
            component: () => import('@/views/locale_setting/index.vue'),
            name: 'LocaleSetting',
            meta: { title: 'locale_setting', requiresAuth: true, showInHome: true },
        },
    '/i18n_message_usage': {
            component: () => import('@/views/i18n_message_usage/index.vue'),
            name: 'I18nMessageUsage',
            meta: { title: 'i18n_message_usage', requiresAuth: true, showInHome: true },
        },
    '/i18n_message': {
            component: () => import('@/views/i18n_message/index.vue'),
            name: 'I18nMessage',
            meta: { title: 'i18n_message', requiresAuth: true, showInHome: true },
        }
};

export function getRouteComponent(
  routePath: string,
): (() => Promise<unknown>) | undefined {
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
      title: config.meta.title,
      name: config.name,
    }));
}

