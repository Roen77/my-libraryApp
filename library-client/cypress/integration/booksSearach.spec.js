/**

 * 1. 사용자는 로그인 후, 메인 페이지로 이동합니다.
 * 2.Header의 '나만의 책장'버튼을 클릭하면  '나만의 책 리스트'를 보여주는 페이지로 이동합니다.
 * 3.책 검색 버튼을 클릭합니다.
 * 4. 책 검색 페이지로 이동합니다.
 * 5. 책을 검색한 후, 리스트가 보여집니다.
 * 6. 검색한 책 중 원하는 책을 선택하여 책을 추가합니다.
 */

describe('책 검색하여 추가하기', () => {
  it('책 검색을 위해 "나만의 책장"페이지로 이동합니다.', () => {
    cy.visit('/')
    // 나만의 책장  버튼의 활성화(active) 확인!
    // 나만의 책장 버튼 클릭!
    cy.get('.gnb .my')
      .click()
    // 이동한 페이지 주소 확인!
    cy.url()
      .should('include', '/books')
    // 페이지 렌더링 기다리기!
    cy.wait(1000)
    // 나만의 책장 버튼의 활성화(active) 확인!
    cy.get('.gnb .nuxt-link-active.my')
  })
  it('플러스 모양의 버튼에 마우스를 올렸을 때 메뉴를 보여줍니다.', () => {
    cy.get('.floating_btn').trigger('mouseenter')
    cy.get('.sub_menu').should('be.visible')
  })
  it('책 검색 버튼을 클릭하여 책 검색 페이지로 이동합니다.', () => {
    cy.get('.sub_menu li:nth-child(2)')
      .click()
    // 이동한 페이지 주소 확인!
    cy.url()
      .should('include', '/books/search')
    // 페이지 렌더링 기다리기!
    cy.wait(1000)
  })
  it('책을 검색합니다', () => {
    // 책 제목 입력!
    cy.get('input[type=text]')
      .type('미운오리 새끼')
    // 책 검색 옵션 선택(제목 옵션 선택)
    cy.get('.main_select')
      .trigger('mouseenter')
    // 책 검색 옵션 메뉴 보이기
    cy.get('.custom_select').should('be.visible')
    cy.get('.custom_select li:nth-child(2)')
      .click()
    // 책 검색 버튼 클릭
    cy.get('button[type=submit]')
      .click()
  })
  it('검색한 책 중 첫번째 책을 추가합니다.', () => {
    // 책 제목 입력!
    cy.get('.search-content .search_book:nth-of-type(2) .addbtn').click()
  })
})
