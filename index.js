const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; 

// Configurar o middleware CORS
app.use(cors({
  origin: 'http://localhost:5173', // Substitua pela origem da sua aplicação React
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'access_token'], 
}));

// Proxy para a API do Asaas Sandbox
app.use('/api/asaas', createProxyMiddleware({
  target: 'https://sandbox.asaas.com/api/v3',
  changeOrigin: true,
  pathRewrite: {
    '^/api/asaas': '', 
  },
  onProxyRes: (proxyRes, req, res) => {
    // Permite acesso de qualquer origem
    proxyRes.setHeader('Access-Control-Allow-Origin', '*'); 
  },
}));

// Endpoint para receber as notificações do Asaas
app.post('/webhook', (req, res) => {
    const dadosPagamento = req.body;
  
    console.log('Notificação do Asaas recebida:', dadosPagamento);
  
    // Verifica se o evento é BILL_PAID
    if (dadosPagamento.event === 'BILL_PAID') {
      // Processa a notificação e atualiza o localStorage
      localStorage.setItem('dadosPagamento', JSON.stringify(dadosPagamento)); 
      console.log('Dados do pagamento salvos no localStorage');
    }
  
    res.status(200).send('OK'); 
  });

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});