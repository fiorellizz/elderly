*** Settings ***
Library         SeleniumLibrary
Suite Setup     Dado que o usuário acessa a tela de login
Suite Teardown  E fecha o navegador

*** Variables ***
${URL}              http://localhost:5173
${BROWSER}          chrome
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BTN_LOGIN}        id=btnLogin
${MENSAGEM_ERRO}    id=mensagemErro
${NAV_LOGOUT}       id=navLogout

*** Test Cases ***
CT01 - Deve realizar login com dados válidos
    Dado que o usuario informa o email    ana@elderly.com
    E informa a senha                     123456
    Quando solicitar o login
    Entao o sistema deve acessar a dashboard
    E o usuario faz logout

CT02 - Deve exibir erro com dados invalidos
    [Setup]    Go To    ${URL}
    Dado que o usuario informa o email    errado@elderly.com
    E informa a senha                     123456
    Quando solicitar o login
    Entao o sistema deve apresentar a mensagem de erro    Credenciais inválidas

*** Keywords ***
Dado que o usuário acessa a tela de login
    # Abre em modo anônimo para evitar o pop-up de senha vazada do Google
    Open Browser    ${URL}    ${BROWSER}    options=add_argument("--incognito")
    Maximize Browser Window
    
    # Deixa o robô mais devagar para dar tempo de acompanhar com os olhos (0.5s por ação)
    Set Selenium Speed    0.5 seconds

Dado que o usuario informa o email
    [Arguments]    ${email}
    Wait Until Element Is Visible    ${INPUT_EMAIL}    timeout=5s
    Input Text     ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}
    Input Password    ${INPUT_SENHA}    ${senha}

Quando solicitar o login
    Click Button    ${BTN_LOGIN}

Entao o sistema deve acessar a dashboard
    Wait Until Element Is Visible    ${NAV_LOGOUT}    timeout=5s

Entao o sistema deve apresentar a mensagem de erro
    [Arguments]    ${mensagem}
    Wait Until Element Is Visible    ${MENSAGEM_ERRO}    timeout=5s
    Element Text Should Be           ${MENSAGEM_ERRO}    ${mensagem}

E o usuario faz logout
    Click Element                    ${NAV_LOGOUT}
    Wait Until Element Is Visible    ${INPUT_EMAIL}      timeout=5s

E fecha o navegador
    Close Browser