export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'libraryapp',
    htmlAttrs: {
      lang: 'ko'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'library App' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: 'library App' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'library App' },
      { hid: 'og:description', property: 'og:description', content: '나만의 책을 정리하고 기록할 수 있는 라이브러리 사이트입니다.' },
      { hid: 'og:url', property: 'og:url', content: 'https://library.roen.pe.kr/' },
      { hid: 'og:image', property: 'og:image', content: 'https://library.roen.pe.kr/images/sample_book.jpg' },
      { hid: 'twitter:site', name: 'twitter:site', content: 'library App' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'https://library.roen.pe.kr' },
      { hid: 'twitter:description', name: 'twitter:description', content: '나만의 책을 정리하고 기록할 수 있는 라이브러리 사이트입니다.' },
      { hid: 'twitter:image', name: 'twitter:image', content: 'https://library.roen.pe.kr/images/sample_book.jpg' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/css/common.css' },
      { rel: 'stylesheet', href: '/css/style.css' }
    ],
    script: [
      { src: 'https://kit.fontawesome.com/0c7f47858a.js' }
    ]
  },
  css: [
    '@/static/css/common.css',
    '@/static/css/style.css'
  ],
  loading: {
    color: '#5C6BC0',
    height: '5px'
  },
  plugins: [
    { src: '~/plugins' },
    { src: '~/plugins/axios' }
  ],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/moment'
  ],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],
  bootstrapVue: {
    bootstrapCSS: true,
    bootstrapVueCSS: true,
    components: ['BPagination'],
    componentPlugins: [
      'FormDatepickerPlugin'
    ]
  },
  moment: {
    defaultLocale: 'ko',
    locales: ['ko']
  },
  axios: {
    browserBaseURL: process.env.NODE_ENV === 'production' ? 'https://app.roen.pe.kr/' : 'http://localhost:5000/',
    baseURL: process.env.NODE_ENV === 'production' ? 'https://app.roen.pe.kr/' : 'http://localhost:5000/',
    credentials: true
  },
  build: {
  },
  server: {
    port: process.env.PORT || 3000
  }
}
