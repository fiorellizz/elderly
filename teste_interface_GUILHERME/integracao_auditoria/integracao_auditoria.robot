*** Settings ***
Library         SeleniumLibrary
Suite Setup     Dado que o cuidador acessa e faz login no sistema
Suite Teardown  Close Browser

*** Variables ***
${URL}              http://localhost:5173
${BROWSER}          chrome
${OPCOES}           add_argument("--headless=new"); add_argument("--no-sandbox"); add_argument("--disable-dev-shm-usage"); add_argument("--window-size=1920,1080")
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        id=btnLogin
${BTN_TOMAR}        id=btnTomar-1
${NAV_AUDITORIA}    id=navAuditoria

*** Test Cases ***
Web 01: Acao no Dashboard reflete na tela de Auditoria
    [Documentation]    Tabela de Decisao / Teste de Integracao: registrar uma dose no Dashboard e validar que o evento passa a constar no Log de Auditoria.
    [Tags]    integracao    auditoria
    Quando registro uma dose no dashboard
    E acesso a aba Auditoria no menu superior
    Entao a tela de auditoria e exibida com o historico

*** Keywords ***
Dado que o cuidador acessa e faz login no sistema
    Open Browser    ${URL}    ${BROWSER}    options=${OPCOES}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text       ${INPUT_EMAIL}    ana@elderly.com
    Input Password   ${INPUT_SENHA}    123456
    Click Element    ${BTN_LOGIN}
    Wait Until Element Is Visible    ${BTN_TOMAR}    10s

Quando registro uma dose no dashboard
    # SPA React: clique via JavaScript garante o disparo do onClick em modo headless
    Execute JavaScript    document.getElementById("btnTomar-1").click()
    Sleep    1s

E acesso a aba Auditoria no menu superior
    Execute JavaScript    document.getElementById("navAuditoria").click()

Entao a tela de auditoria e exibida com o historico
    Wait Until Page Contains    Log de Auditoria    10s
    Page Should Contain         registros auditados
    Page Should Contain         Losartana
