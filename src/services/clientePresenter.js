// Converte os dados crus do Firestore no mesmo formato que as telas já esperavam
// dos mocks — assim a troca de mock por Firestore não muda nada visualmente.

// Ícone Feather por tipo de produto (mesmo mapa do mock da Início/Produtos).
const ICONE_POR_TIPO = {
  Site: 'globe',
  'E-commerce': 'shopping-bag',
  Aplicativo: 'smartphone',
  Sistema: 'grid',
};

export function iconePorTipo(tipo) {
  return ICONE_POR_TIPO[tipo] ?? 'box';
}

// "R$ 249,00" — o mock exibia sempre com centavos.
export function formatarValor(valor) {
  const numero = Number(valor) || 0;
  return `R$ ${numero.toFixed(2).replace('.', ',')}`;
}

// Valor mensal do produto para o card de Produtos. Sem valor definido (campo
// ausente ou 0) retorna "—" em vez de "R$ 0,00", pra não parecer erro.
export function formatarValorProduto(valor) {
  const numero = Number(valor) || 0;
  if (numero <= 0) {
    return '—';
  }
  return `${formatarValor(numero)}/mês`;
}

// "R$ 429 em aberto" — resumo curto usado no atalho da Início (sem centavos).
export function formatarTotalEmAberto(total) {
  const numero = Number(total) || 0;
  return `R$ ${numero} em aberto`;
}

// Iniciais do nome para o avatar do Perfil: "Marina Flores" -> "MF".
export function iniciaisDoNome(nome) {
  if (!nome) {
    return '';
  }
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

// Subtítulo da fatura, conforme o status (igual ao mock).
export function subtituloFatura(fatura) {
  if (fatura.status === 'pago') {
    return `Pago em ${fatura.pagoEm ?? fatura.vencimento}`;
  }
  if (fatura.status === 'atrasado') {
    return `Venceu em ${fatura.vencimento}`;
  }
  return `Vence em ${fatura.vencimento}`;
}

// Faturas em aberto = pendentes + atrasadas.
export function estaEmAberto(fatura) {
  return fatura.status === 'pendente' || fatura.status === 'atrasado';
}

// Soma dos valores das faturas em aberto.
export function totalEmAberto(faturas) {
  return faturas.filter(estaEmAberto).reduce((soma, f) => soma + (Number(f.valor) || 0), 0);
}

// Próxima fatura para o card de destaque da Início: prioriza atrasada; senão,
// a primeira pendente. Retorna null se não houver nenhuma em aberto.
export function proximaFatura(faturas) {
  const atrasada = faturas.find((f) => f.status === 'atrasado');
  if (atrasada) {
    return atrasada;
  }
  return faturas.find((f) => f.status === 'pendente') ?? null;
}
