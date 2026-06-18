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
${MENSAGEM_SYS}     id=mensagemSistema
${ESTOQUE_MED1}     xpath=//button[@id="btnTomar-1"]/ancestor::div[contains(@class,"rounded-2xl")][1]//span[contains(@class,"text-base")]

*** Test Cases ***
Web 01: Registrar dose deve dar baixa no estoque
    [Documentation]    Tabela de Decisao: cuidador autenticado + clique em "Registrar Dose" -> dose registrada e estoque reduzido em 1 unidade.
    [Tags]    consumo    estoque
    ${qtd_antes}=    Obter o estoque atual do medicamento
    Quando clico em Registrar Dose
    Entao o alerta verde de sucesso e exibido
    E o estoque exibido diminui em uma unidade    ${qtd_antes}

*** Keywords ***
Dado que o cuidador acessa e faz login no sistema
    Open Browser    ${URL}    ${BROWSER}    options=${OPCOES}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text       ${INPUT_EMAIL}    ana@elderly.com
    Input Password   ${INPUT_SENHA}    123456
    Click Element    ${BTN_LOGIN}
    Wait Until Element Is Visible    ${BTN_TOMAR}    10s

Obter o estoque atual do medicamento
    ${texto}=    Get Text    ${ESTOQUE_MED1}
    ${qtd}=      Convert To Integer    ${texto.split()[0]}
    RETURN       ${qtd}

Quando clico em Registrar Dose
    # SPA React: clique via JavaScript garante o disparo do onClick em modo headless
    Execute JavaScript    document.getElementById("btnTomar-1").click()

Entao o alerta verde de sucesso e exibido
    Wait Until Element Is Visible    ${MENSAGEM_SYS}    10s
    Element Should Contain           ${MENSAGEM_SYS}    Dose registrada com sucesso

E o estoque exibido diminui em uma unidade
    [Arguments]    ${qtd_antes}
    ${esperado}=    Evaluate    ${qtd_antes} - 1
    Wait Until Keyword Succeeds    10x    1s    O estoque exibido deve ser    ${esperado}

O estoque exibido deve ser
    [Arguments]    ${esperado}
    ${texto}=    Get Text    ${ESTOQUE_MED1}
    ${atual}=    Convert To Integer    ${texto.split()[0]}
    Should Be Equal As Integers    ${atual}    ${esperado}
