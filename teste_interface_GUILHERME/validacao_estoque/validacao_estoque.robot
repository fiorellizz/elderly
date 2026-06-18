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
${NAV_CADASTRO}     id=navCadastro
${INPUT_QTD}        id=quantidade

*** Test Cases ***
Web 02: Campo Estoque Inicial deve bloquear caracteres alfabeticos
    [Documentation]    Particao de Equivalencia (entrada invalida - letras): o campo numerico "Estoque Inicial" deve rejeitar a entrada "ABC" e permanecer vazio.
    [Tags]    cadastro    validacao
    Dado que acesso a tela de cadastro
    Quando digito letras no campo Estoque Inicial    ABC
    Entao o campo Estoque Inicial permanece vazio

*** Keywords ***
Dado que o cuidador acessa e faz login no sistema
    Open Browser    ${URL}    ${BROWSER}    options=${OPCOES}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text       ${INPUT_EMAIL}    ana@elderly.com
    Input Password   ${INPUT_SENHA}    123456
    Click Element    ${BTN_LOGIN}
    Wait Until Element Is Visible    ${NAV_CADASTRO}    10s

Dado que acesso a tela de cadastro
    Click Element    ${NAV_CADASTRO}
    Wait Until Element Is Visible    ${INPUT_QTD}    10s

Quando digito letras no campo Estoque Inicial
    [Arguments]    ${letras}
    Input Text    ${INPUT_QTD}    ${letras}

Entao o campo Estoque Inicial permanece vazio
    ${valor}=    Get Value    ${INPUT_QTD}
    Should Be Empty    ${valor}
