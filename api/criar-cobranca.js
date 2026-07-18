// Endpoint serverless (Vercel): cria uma preference no Mercado Pago (Checkout Pro)
// e devolve o init_point pro app abrir o checkout.

const MP_PREFERENCES_URL = 'https://api.mercadopago.com/checkout/preferences';

function aplicarCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  aplicarCors(res);

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('MP_ACCESS_TOKEN não configurado no ambiente.');
    return res.status(500).json({ error: 'Configuração de pagamento ausente no servidor.' });
  }

  // O body pode chegar como string dependendo do runtime; normaliza.
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Body inválido: JSON malformado.' });
    }
  }
  body = body || {};

  const { faturaId, clienteId, valor, descricao, email } = body;

  // Validação dos campos obrigatórios
  const faltando = [];
  if (!faturaId) faltando.push('faturaId');
  if (!clienteId) faltando.push('clienteId');
  if (valor === undefined || valor === null || valor === '') faltando.push('valor');
  if (!descricao) faltando.push('descricao');
  if (!email) faltando.push('email');

  if (faltando.length > 0) {
    return res.status(400).json({
      error: `Campos obrigatórios ausentes: ${faltando.join(', ')}.`,
    });
  }

  const valorNumerico = Number(valor);
  if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
    return res.status(400).json({ error: 'Campo "valor" deve ser um número maior que zero.' });
  }

  const PORTAL_URL = process.env.PORTAL_URL || '';
  const API_URL = process.env.API_URL || '';

  const preference = {
    items: [
      {
        title: descricao,
        quantity: 1,
        unit_price: valorNumerico,
        currency_id: 'BRL',
      },
    ],
    payer: { email },
    external_reference: `${clienteId}:${faturaId}`, // pra reconciliar no webhook
    payment_methods: {
      installments: 12,
      default_installments: 1,
      installment_amount_paid_by_payer: true,
    },
    back_urls: {
      success: `${PORTAL_URL}/pagamento/sucesso`,
      failure: `${PORTAL_URL}/pagamento/falha`,
      pending: `${PORTAL_URL}/pagamento/pendente`,
    },
    auto_return: 'approved',
    notification_url: `${API_URL}/api/webhook-mp`,
  };

  try {
    const resposta = await fetch(MP_PREFERENCES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error('Erro do Mercado Pago:', resposta.status, dados);
      return res.status(502).json({ error: 'Não foi possível criar a cobrança no Mercado Pago.' });
    }

    return res.status(200).json({
      initPoint: dados.init_point,
      preferenceId: dados.id,
    });
  } catch (erro) {
    console.error('Falha ao criar cobrança no Mercado Pago:', erro);
    return res.status(500).json({ error: 'Erro interno ao criar a cobrança.' });
  }
};
