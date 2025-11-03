import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/sys/user/list',
    method: 'get',
    params: { ...params, name: params.key, userName: params.key }
  })
}

export function add(data) {
  return request({
    url: '/api/sys/user/add',
    method: 'post',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/api/sys/user/delete',
    method: 'post',
    params: { ids }
  })
}

export function edit(data) {
  return request({
    url: '/api/sys/user/edite',
    method: 'post',
    data
  })
}

export function resetCipher(data) {
  return request({
    url: '/api/sys/user/password/reset',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/api/sys/user/status/switch',
    method: 'post',
    data
  })
}


