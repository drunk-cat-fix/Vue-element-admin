import request from '@/utils/request'

export function getGoodsList(goodsId) {
  return request({
    url: '/api//goods/detail',
    method: 'get',
    params: { goodsId }
  })
}

export function add(data) {
  return request({
    url: '/api//goods/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/api//goods/edite',
    method: 'post',
    data
  })
}

export function postageUpdate(data) {
  return request({
    url: '/api/goods/postage/update',
    method: 'post',
    data
  })
}

export function attrUpdate(data) {
  return request({
    url: '/api/goods/attr/update',
    method: 'post',
    data
  })
}

export function skuUpdate(data) {
  return request({
    url: '/api/goods/sku/update',
    method: 'post',
    data
  })
}

export function detailIntroUpdate(data) {
  return request({
    url: '/api/goods/detailIntro/update',
    method: 'post',
    data
  })
}

export function categorizeUpdate(data) {
  return request({
    url: '/api/goods/categorize/update',
    method: 'post',
    data
  })
}

export function getList(params) {
  return request({
    url: '/api/goods/list',
    method: 'get',
    params
  })
}

export function del(ids) {
  return request({
    url: '/api/goods/delete',
    method: 'post',
    params: { ids }
  })
}

export function changeStatus(goodsIds) {
  return request({
    url: '/api/goods/status/switch',
    method: 'post',
    data: { goodsIds }
  })
}
