*** Settings ***
Library         SeleniumLibrary
Suite Setup     Dado que o cuidador acessa e faz login no sistema
Suite Teardown  Close Browser

*** Variables ***
${URL}                  http://localhost:5173
${BROWSER}              chrome
${OPCOES}               add_argument("--headless=new"); add_argument("--no-sandbox"); add_argument("--disable-dev-shm-usage"); add_argument("--window-size=1920,1080")
${INPUT_EMAIL}          id=email
${INPUT_SENHA}          id=senha
${BTN_LOGIN}            id=btnLogin
${NAV_AUDITORIA}        id=navAuditoria
${BTN_TOMAR_ZERADO}     id=btnTomar-4

*** Test Cases ***
Web 02: Botao Registrar Dose deve estar desabilitado com estoque zerado
    [Documentation]    Particao de Equivalencia (estoque = 0): o medicamento sem estoque mantem o botao "Registrar Dose" desabilitado, impedindo o clique.
    [Tags]    consumo    estoque    borda
    Wait Until Element Is Visible    ${BTN_TOMAR_ZERADO}    10s
    Element Should Be Disabled       ${BTN_TOMAR_ZERADO}

*** Keywords ***
Dado que o cuidador acessa e faz login no sistema
    Open Browser    ${URL}    ${BROWSER}    options=${OPCOES}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text       ${INPUT_EMAIL}    ana@elderly.com
    Input Password   ${INPUT_SENHA}    123456
    Click Element    ${BTN_LOGIN}
    Wait Until Element Is Visible    ${NAV_AUDITORIA}    10s
