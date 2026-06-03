*** Settings ***
Library         SeleniumLibrary
Suite Setup     Dado que o sistema esta logado
Suite Teardown  E fecha o navegador

*** Variables ***
${URL}              http://localhost:5173
${BROWSER}          chrome
${INPUT_NOME}       id=nomeMedicamento
${INPUT_DOSAGEM}    id=dosagem
${INPUT_QTD}        id=quantidade
${BTN_SALVAR}       id=btnSalvar
${MENSAGEM_SYS}     id=mensagemSistema

*** Test Cases ***
CT03 - Deve cadastrar medicamento valido
    Dado que o usuário acessa a tela de cadastro
    E o usuario preenche o form    Losartana    50mg    10
    Quando clica em salvar
    Entao o sistema exibe a mensagem    Medicamento cadastrado!

CT04 - Deve bloquear quantidade zero
    # Como o CT03 redireciona pro Dashboard após o sucesso, nós mandamos o robô clicar na aba Cadastrar de novo
    Dado que o usuário acessa a tela de cadastro
    E o usuario preenche o form    Aspirina     500mg   0
    Quando clica em salvar
    Entao o sistema exibe a mensagem    A quantidade deve ser maior que zero

*** Keywords ***
Dado que o sistema esta logado
    # Abre o navegador limpo, tela cheia e devagar para você assistir
    Open Browser    ${URL}    ${BROWSER}    options=add_argument("--incognito")
    Maximize Browser Window
    Set Selenium Speed    0.5 seconds
    
    # Faz o login obrigatório
    Wait Until Element Is Visible    id=email    timeout=5s
    Input Text        id=email    ana@elderly.com
    Input Password    id=senha    123456
    Click Button      id=btnLogin

Dado que o usuário acessa a tela de cadastro
    Wait Until Element Is Visible    id=navCadastro    timeout=5s
    Click Element     id=navCadastro
    Wait Until Element Is Visible    ${INPUT_NOME}     timeout=5s

E o usuario preenche o form
    [Arguments]    ${nome}    ${dosagem}    ${qtd}
    # O Input Text do Robot já apaga o que estiver no campo antes de digitar
    Input Text    ${INPUT_NOME}       ${nome}
    Input Text    ${INPUT_DOSAGEM}    ${dosagem}
    Input Text    ${INPUT_QTD}        ${qtd}

Quando clica em salvar
    Click Button    ${BTN_SALVAR}

Entao o sistema exibe a mensagem
    [Arguments]    ${mensagem}
    Wait Until Element Is Visible    ${MENSAGEM_SYS}    timeout=5s
    Element Text Should Be           ${MENSAGEM_SYS}    ${mensagem}

E fecha o navegador
    Close Browser
