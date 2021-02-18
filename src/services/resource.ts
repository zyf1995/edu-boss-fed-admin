/**
 * 资源管理接口封装
*/
import request from '@/utils/request'
// eslint-disable-next-line
export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

export const getAllCategory = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}
