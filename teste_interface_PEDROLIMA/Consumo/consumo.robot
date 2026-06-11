*** Settings ***
Library         SeleniumLibrary
Suite Setup     Dado que o utilizador acede e faz login no sistema
Suite Teardown  Close Browser

*** Variables ***
${URL}              http://localhost:5173
${BROWSER}          chrome
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        xpath=//*[@id="btnLogin"]
${BTN_REGISTRAR}    xpath=//*[@id="btnTomar-1"]

*** Test Cases ***
Web 01: Exibir alerta verde confirmando a dose de medicamento
    [Documentation]   
    [Tags]             consumo
    Quando clico no botao Registrar Dose
    Entao Exibir alerta verde confirmando a dose de medicamento

*** Keywords ***
Dado que o utilizador acede e faz login no sistema
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text      ${INPUT_EMAIL}    ana@elderly.com
    Input Text      ${INPUT_SENHA}    123456
    Click Element   ${BTN_LOGIN}
    Wait Until Element Is Visible    ${BTN_REGISTRAR}    10s

Quando clico no botao Registrar Dose
    Click Element    ${BTN_REGISTRAR}
    Sleep    2s

Entao Exibir alerta verde confirmando a dose de medicamento
    Page Should Contain Element    xpath=//*[@id="mensagemSistema"]