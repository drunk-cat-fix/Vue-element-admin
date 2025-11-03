import request from '@/utils/request'

export function tree() {
  return request({
    url: '/api/sys/menu/tree',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/sys/menu/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/sys/menu/delete',
    method: 'post',
    params: { ids }
  })
}

export function edit(data) {
  return request({
    url: '/api/sys/menu/edite',
    method: 'post',
    data
  })
}
