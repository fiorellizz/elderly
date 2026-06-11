*** Settings ***
Library         SeleniumLibrary
Suite Setup     Dado que o usuário acessa e loga no sistema
Suite Teardown  Close Browser

*** Variables ***
${URL}              http://localhost:5173
${BROWSER}          chrome
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        xpath=//*[@id="btnLogin"]
${BTN_SAIR}         xpath=//*[@id="navLogout"]

*** Test Cases ***
Web 02: Realizar Logout com sucesso e voltar para a tela inicial
    [Documentation]    O robô loga no sistema, clica em "Sair" e valida a volta para a tela inicial de login.
    [Tags]             logout    acesso
    Quando clico no botão "Sair" no menu superior
    Então devo ser redirecionado para a tela inicial de login
    E o campo de e-mail deve estar visível novamente

*** Keywords ***
Dado que o usuário acessa e loga no sistema
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text      ${INPUT_EMAIL}    ana@elderly.com
    Input Text      ${INPUT_SENHA}    123456
    Click Element   ${BTN_LOGIN}
    Wait Until Element Is Visible    ${BTN_SAIR}    10s

Quando clico no botão "Sair" no menu superior
    Click Element    ${BTN_SAIR}

Então devo ser redirecionado para a tela inicial de login
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s

E o campo de e-mail deve estar visível novamente
    Page Should Contain Element    ${INPUT_EMAIL}
    Location Should Be             ${URL}/