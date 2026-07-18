// Chama a API do Portal JH (Vercel) que cria a cobrança no Mercado Pago (Checkout Pro)
// e devolve o link de pagamento (initPoint) pro app abrir.

export const API_BASE_URL = 'https://portal-jh.vercel.app';

// Cria a cobrança de uma fatura e retorna { initPoint, preferenceId }.
// Lança Error com mensagem amigável em pt-BR em caso de falha.
export async function criarCobranca({ fatura, cliente }) {
  const body = {
    faturaId: fatura.id,
    clienteId: cliente.id,
    valor: fatura.valor,
    descricao: fatura.mesRef,
    email: cliente.email,
  };

  let resposta;
  try {
    resposta = await fetch(`${API_BASE_URL}/api/criar-cobranca`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (erro) {
    // Falha de rede (sem internet, servidor fora do ar etc.).
    console.error('criarCobranca (rede):', erro);
    throw new Error(
      'Não foi possível conectar ao servidor de pagamento. Verifique sua conexão e tente de novo.',
    );
  }

  let dados = null;
  try {
    dados = await resposta.json();
  } catch (erro) {
    dados = null;
  }

  if (!resposta.ok || !dados?.initPoint) {
    console.error('criarCobranca (resposta):', resposta.status, dados);
    throw new Error(
      'Não foi possível gerar o pagamento agora. Tente novamente em instantes.',
    );
  }

  return { initPoint: dados.initPoint, preferenceId: dados.preferenceId };
}
