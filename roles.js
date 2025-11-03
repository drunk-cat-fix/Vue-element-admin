import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api//sys/role/list',
    method: 'get',
    params
  })
}

export function del(ids) {
  return request({
    url: '/api//sys/role/delete',
    method: 'post',
    params: { ids }
  })
}

export function add(data) {
  return request({
    url: '/api//sys/role/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/api//sys/role/edite',
    method: 'post',
    data
  })
}

export function loadingAuth(roleId) {
  return request({
    url: '/api//sys/role/auth/get',
    method: 'get',
    params: { roleId }
  })
}

export function authUpdate(data) {
  return request({
    url: '/api//sys/role/auth/update',
    method: 'post',
    data
  })
}
