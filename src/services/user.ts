/**
 * 用户接口封装
*/
import request from '@/utils/request'
import qs from 'qs'

interface UserForm {
  phone: string;
  password: string;
}
export const login = (data: UserForm) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}

export const getInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// eslint-disable-next-line
export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}
