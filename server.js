require('dotenv').config();

const axios = require('axios');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const state = {};

app.post('/webhook', async (req, res) => {
  const msg = req.body.Body;
  const from = req.body.From;

  if (!state[from]) {
    state[from] = { step: 1 };
    return res.send(`<Response><Message>Olá! 👋\n\nObrigado pelo contato! Somos da ACV Brasil. \n\nPara te ajudar melhor, vou fazer 2 perguntas rápidas e te respondemos por e-mail com mais detalhes (normalmente em até 1 dia útil).\n\nO que você precisa?</Message></Response>`);
  }

  if (state[from].step === 1) {
    state[from].need = msg;
    state[from].step = 2;
    return res.send(`<Response><Message>Perfeito 👍 Qual é o seu e-mail?</Message></Response>`);
  }

  if (state[from].step === 2) {
    const email = msg;

  const lead = {
    phone: from,
    need: state[from].need,
    email
  };


    delete state[from];

    res.send(`<Response><Message>Obrigado! ✅\n\nRecebemos sua solicitação e vamos te responder por e-mail em breve.</Message></Response>`);

await axios.post(process.env.TEAMS_WEBHOOK_URL, {
  text: `📩 Novo contato via WhatsApp

Telefone: ${lead.phone}\n\n
Demanda: ${lead.need}\n\n
Email: ${lead.email}`
});
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});