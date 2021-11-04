// 카카오 api 호출시 가져오는 썸네일 이미지 크기 수정(고화질 이미지를 위한 처리)
const resizeImage = (url, size = 800) => {
  const src = url.replace('/thumb/R120x174', `/thumb/R${size}x${size}`)
  return src
}
// 이미지 로드 확인
const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.src = src
    img.addEventListener('load', () => {
      // 완료
      resolve()
    })
  })
}
export { resizeImage, loadImage }
