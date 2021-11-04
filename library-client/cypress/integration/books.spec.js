/**

 * 1. 사용자는 로그인 후, 메인 페이지로 이동합니다.
 * 3.Header의 '나만의 책장'버튼을 클릭하면  '나만의 책 리스트'를 보여주는 페이지로 이동합니다.
 * 4.그리고 나만의 책 리스트 중 원하는 책을 클릭하면,
 * 책의 상세 정보 페이지로 이동합니다.
 * 책의 상세 정보를 확인할 수 있습니다.
 */

describe('나만의 책 리스트를 확인하기 위해 페이지를 이동합니다.', () => {
  it('메인 페이지로 이동합니다.', () => {
    cy.visit('/')
    // 나만의 책장  버튼의 활성화(active) 확인!
  })
  it('"나만의 책장" 페이지로 이동합니다', () => {
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
  it('"나만의 책"리스트 중 첫번째 책을 클릭 후, 책 상세 페이지로 이동합니다.', () => {
    // 나만의 책장 버튼 클릭!
    cy.get('.books .book:nth-child(1)')
      .click()
    // 이동한 페이지 주소 확인!
    cy.url()
      .should('include', '/books/b')
    // 페이지 렌더링 기다리기!
    cy.wait(1000)
  })
})

describe('다른 사용자의 책 리스트를 확인하기 위해 페이지를 이동합니다.', () => {
  it('메인 페이지로 이동합니다.', () => {
    cy.visit('/')
    // 나만의 책장  버튼의 활성화(active) 확인!
  })
  it('"다른 사람 책장" 페이지로 이동합니다', () => {
    // 나만의 책장 버튼 클릭!
    cy.get('.gnb .others')
      .click()
      // 이동한 페이지 주소 확인!
    cy.url()
      .should('include', '/books/others')
      // 페이지 렌더링 기다리기!
    cy.wait(1000)
    // 나만의 책장 버튼의 활성화(active) 확인!
    cy.get('.gnb .nuxt-link-active.others')
  })
  it('"다른 사용자의 책"리스트 중 첫번째 책을 클릭 후, 책 상세 페이지로 이동합니다.', () => {
    // 나만의 책장 버튼 클릭!
    cy.get('.books .book:nth-child(1)')
      .click()
      // 이동한 페이지 주소 확인!
    cy.url()
      .should('include', '/books/others/b')
      // 페이지 렌더링 기다리기!
    cy.wait(1000)
  })
})
