import { AdminLayout, BlankLayout, RouterView } from '@/layouts'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        redirect: '/dashboard/index',
        name: 'Dashboard',
        component: RouterView,
        hideChildrenInMenu: true,
        meta: {
          title: '首页',
          icon: 'home'
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/dashboard/index')
          }
        ]
      }
    ]
  },
  {
    path: '/',
    name: 'blankIndex',
    component: BlankLayout,
    children: [
      {
        path: '/data-view-instance',
        redirect: '/data-view-instance/index',
        component: RouterView,
        hidden: true,
        children: [
          {
            path: 'create',
            component: () => import('@/views/data-view/instance/index'),
            meta: {
              title: '可视化大屏创建'
            }
          }
        ]
      },
      {
        path: '/data-report-instance',
        redirect: '/data-report-instance/index',
        component: RouterView,
        hidden: true,
        children: [
          {
            path: 'create',
            component: () => import('@/views/data-report/instance/index'),
            meta: {
              title: '报表创建'
            }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
