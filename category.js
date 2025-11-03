import request from '@/utils/request'

export function getCategoryList(type) {
  return request({
    url: '/api//categorize/list',
    method: 'get',
    params: { pageShow: false, type }
  })
}

export function add(data) {
  return request({
    url: '/api//categorize/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api//categorize/delete',
    method: 'post',
    params: { ids }
  })
}

export function edit(data) {
  return request({
    url: '/api//categorize/edite',
    method: 'post',
    data
  })
}
