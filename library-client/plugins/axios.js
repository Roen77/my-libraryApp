import ischk from 'is-iexplorer'

export default function ({ $axios, error, redirect }) {
  // IE 에서 get 메서드 호출시 캐시문제로 재호출이 되지 않는 문제 발생으로 브라우저가 IE일경우, 요청헤더에 아래 내용 추가
  $axios.onRequest((config) => {
    if (ischk) {
      config.headers['Cache-Control'] = 'no-cache'
      config.headers.Pragma = 'no-cache'
    }
    return config
  })
  // 오류 처리
  $axios.onError((err) => {
    const code = parseInt(err.response && err.response.status)
    if (code === 401) {
      if (err.response.data.auth) {
        // 인증이 필요한 상태이고,로그인이 되어 있지 않을 때 로그인 페이지로 이동
        return redirect('auth/login')
      } else if (err.response.data.authed) {
        // 인증이 필요한 상태이고,로그인이 이미 되어 있으면 메인페이지로 이동
        return redirect('/')
      }
    }
    if (code === 404 || code === 400 || code === 500) {
      return error({
        statusCode: err.response.status,
        msg: err.response.data.msg
      })
    }
  })
}
