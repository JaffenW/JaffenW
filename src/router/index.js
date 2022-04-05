import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'
import SelectAddress from '@/views/SelectAddress'
import OrderList from '@/views/OrderList'
import Manage from '@/views/Manage'
import User from '@/views/manage/User'
import Good from '@/views/manage/Good'
import Order from '@/views/manage/Order'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component:GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component:Cart
    },
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/address',
      name: 'Address',
      component:Address
    },
    {
      path: '/selectAddress',
      name: 'SelectAddress',
      component: SelectAddress
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component:OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component:OrderSuccess
    },
    {
      path: '/orderList',
      name: 'OrderList',
      component: OrderList
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage,
      children: [
        {
          path: '',
          redirect: '/manage/user'
        },
        {
          path: 'user',
          component:User
        },
        {
          path: 'good',
          component: Good
        },
        {
          path: 'order',
          component: Order
        }
      ]
    }
  ]
})
