import request from '@/utils/request'

// The real address is http://local:8080/login
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function get_code() {
  return request({
    url: '/api/login/code',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/api/sys/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}

export function updatePassword({ password, newPassword }) {
  return request({
    url: '/api/sys/password/update',
    method: 'post',
    data: { password, newPassword }
  })
}

export function updateInfo({ name, phone }) {
  return request({
    url: '/api/sys/info/update',
    method: 'post',
    data: { name, phone }
  })
}

export function info() {
  return request({
    url: '/api/sys/info',
    method: 'get'

  })
}
