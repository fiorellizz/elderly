const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'elderly_secret_key_para_testes';

// 1. Configuração do Banco de Dados SQLite
const db = new sqlite3.Database('./elderly.db', (err) => {
    if (err) console.error('Erro ao conectar ao SQLite:', err.message);
    else console.log('Conectado ao banco de dados SQLite.');
});

// Inicialização das Tabelas e Mock de Dados
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS USUARIOS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT, email TEXT UNIQUE, senha TEXT, perfil TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS MEDICAMENTOS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT, dosagem TEXT, quantidade INTEGER, 
        data_compra TEXT, data_validade TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS CONSUMOS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicamento_id INTEGER, quantidade_consumida INTEGER, data_consumo TEXT,
        FOREIGN KEY(medicamento_id) REFERENCES MEDICAMENTOS(id)
    )`);

    // Mock de usuário para permitir os testes
    db.run(`INSERT OR IGNORE INTO USUARIOS (nome, email, senha, perfil) 
            VALUES ('Ana Cuidadora', 'ana@elderly.com', '123456', 'CUIDADOR')`);
});

// Middleware de Autenticação
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ erro: 'Token inválido' });
        req.userId = decoded.id;
        next();
    });
};

// ==========================================
// ENDPOINTS DA API (Foco em Testabilidade)
// ==========================================

// API 01: Login (RF1)
app.post('/auth/login', (req, res) => {
    const { email, senha } = req.body;
    db.get(`SELECT * FROM USUARIOS WHERE email = ? AND senha = ?`, [email, senha], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ status: 'erro', mensagem: 'Credenciais inválidas' });
        }
        const token = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ status: 'sucesso', token, usuario: user.nome });
    });
});

// API 02: Cadastro de Medicamento (RF2)
app.post('/medicamentos', authMiddleware, (req, res) => {
    const { nome, dosagem, quantidade, data_compra, data_validade } = req.body;
    
    // Regra simples para o teste de BVA ou EP (Campos Vazios)
    if (!nome || !dosagem || quantidade === undefined) {
        return res.status(400).json({ status: 'erro', mensagem: 'Campos obrigatórios ausentes' });
    }

    if (quantidade <= 0) {
        return res.status(400).json({ status: 'erro', mensagem: 'Quantidade deve ser maior que zero' });
    }

    const query = `INSERT INTO MEDICAMENTOS (nome, dosagem, quantidade, data_compra, data_validade) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nome, dosagem, quantidade, data_compra, data_validade], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ status: 'sucesso', mensagem: 'Medicamento registrado com sucesso', id: this.lastID });
    });
});

// API 03: Listar Medicamentos (RF3)
app.get('/medicamentos', authMiddleware, (req, res) => {
    db.all(`SELECT * FROM MEDICAMENTOS`, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});

// API 04: Registrar Consumo (RF4)
app.post('/consumos', authMiddleware, (req, res) => {
    const { medicamento_id, quantidade_consumida } = req.body;
    const data_consumo = new Date().toISOString();

    db.run(`UPDATE MEDICAMENTOS SET quantidade = quantidade - ? WHERE id = ?`, [quantidade_consumida, medicamento_id], (err) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        db.run(`INSERT INTO CONSUMOS (medicamento_id, quantidade_consumida, data_consumo) VALUES (?, ?, ?)`, 
        [medicamento_id, quantidade_consumida, data_consumo], function(err) {
            if (err) return res.status(500).json({ erro: err.message });
            res.status(201).json({ status: 'sucesso', mensagem: 'Consumo registrado e estoque atualizado' });
        });
    });
});

// API 05: Auditoria Administrativa (RF9)
app.get('/admin/auditoria', authMiddleware, (req, res) => {
    const query = `
        SELECT C.id, M.nome as medicamento, C.quantidade_consumida, C.data_consumo 
        FROM CONSUMOS C
        JOIN MEDICAMENTOS M ON C.medicamento_id = M.id
        ORDER BY C.data_consumo DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend Elderly rodando na porta ${PORT}`);
    console.log(`Credenciais de teste: ana@elderly.com / 123456`);
});