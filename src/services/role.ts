/**
 * 角色管理接口封装
*/
import request from '@/utils/request'
// eslint-disable-next-line
export const getRolePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

// eslint-disable-next-line
export const saveOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

export const getRoleById = (id: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

export const deleteRoleById = (id: string | number) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// eslint-disable-next-line
export const allocateUserRoles = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

export const getRoleUserById = (userId: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
