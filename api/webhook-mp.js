// Endpoint serverless (Vercel): webhook do Mercado Pago.
// Placeholder — apenas responde 200 rápido e loga o body.
// A atualização do Firestore (reconciliar pagamento por external_reference)
// vem no próximo passo.

function aplicarCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  aplicarCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  // O MP espera um 200 rápido; loga e responde na sequência.
  console.log('Webhook Mercado Pago recebido:', JSON.stringify(req.body));

  return res.status(200).json({ received: true });
};
