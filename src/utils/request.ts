import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}
// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
let isRefreshing = false // 控制刷新token的状态
// eslint-disable-next-line
let requests: any = [] // 存储刷新token期间过来的401请求
request.interceptors.response.use(function (response) {
  // console.log('响应进入了', response)
  return response
}, async function (error) {
  if (error.response) { // 请求收到响应了，状态码超出了2XX
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      //
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 刷新token
      if (!isRefreshing) {
        isRefreshing = true
        // 尝试刷新token
        return refreshToken().then((res) => {
          if (!res.data.success) {
            throw new Error('属性 Token 失败')
          }
          store.commit('setUser', res.data.content)
          // eslint-disable-next-line
          requests.forEach((cb: any) => cb())
          requests = []
          return request(error.config) // 重新发送请求
        }).catch(err => {
          console.log(err)
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false
        })
      }

      // 把请求挂起到requests数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务器错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出了，但是没有收到响应 (超时，网络断开等)
    Message.error('请求超时，请刷新重试')
  } else { // 设置请求时发生了一些事件，触发了一个错误
    Message.error(`请求失败${error.message}`)
  }

  return Promise.reject(error)
})

export default request
