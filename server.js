const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// COLA SUAS CHAVES DO SUPABASE AQUI
const supabase = createClient('SUA_URL_DO_SUPABASE', 'SUA_CHAVE_ANON')

app.use(express.static('public'));
app.use(express.json());

// Rota de Login
app.post('/login', async (req,res) => {
  const {email, password} = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({email, password});
  if(error) return res.status(401).json({error: error.message});
  res.json({user: data.user});
})

// Rota de Cadastro
app.post('/cadastro', async (req,res) => {
  const {email, password} = req.body;
  const { data, error } = await supabase.auth.signUp({email, password});
  if(error) return res.status(400).json({error: error.message});
  res.json({user: data.user});
})

// Rota de Recuperar Senha
app.post('/recuperar', async (req,res) => {
  const {email} = req.body;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if(error) return res.status(400).json({error: error.message});
  res.json({msg: 'Email de recuperação enviado'});
})

// WebRTC continua igual...
io.on('connection', (socket) => { /* ...código anterior... */ });

server.listen(3000);
