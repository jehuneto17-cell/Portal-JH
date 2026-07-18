// Seed do Firestore com os mesmos dados mocados das telas (cliente de teste: Marina).
// Rodar: node scripts/seed.js
// ANTES DE RODAR: substitua COLE_AQUI_O_UID pelo UID real do usuário no Firebase Auth.

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection } = require('firebase/firestore');

// Mesma config de src/config/firebase.js (repetida aqui porque aquele arquivo
// importa módulos de React Native que não rodam em Node).
const firebaseConfig = {
  apiKey: 'AIzaSyChykr7CnbYCxcot3THO1wocx9q2FFiqyU',
  authDomain: 'jh-cobranca.firebaseapp.com',
  projectId: 'jh-cobranca',
  storageBucket: 'jh-cobranca.firebasestorage.app',
  messagingSenderId: '886291146836',
  appId: '1:886291146836:web:2d557e8ea649f8267ee5c1',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cliente = {
  uid: 'Ia9CsQsL1IVJ21h0DiLQ6E6vQix2',
  nome: 'Marina Flores',
  empresa: 'Ateliê Marina Flores',
  email: 'marina@atelieflores.com.br',
  whatsapp: '+55 11 98421-7788',
  plano: 'Manutenção · Mensal',
  clienteDesde: 'Set/2024',
};

const produtos = [
  { nome: 'Site Institucional', tipo: 'Site', url: 'atelieflores.com.br', status: 'ativo', ordem: 1 },
  { nome: 'Loja Virtual', tipo: 'E-commerce', url: 'loja.atelieflores.com.br', status: 'ativo', ordem: 2 },
  { nome: 'App (Play Store)', tipo: 'Aplicativo', url: 'play.google.com', status: 'dev', ordem: 3 },
  { nome: 'Painel de Pedidos', tipo: 'Sistema', url: '', status: 'pausado', ordem: 4 },
];

const faturas = [
  { mesRef: 'Julho 2026', valor: 249, vencimento: '15/07/2026', status: 'pendente', ordem: 1 },
  { mesRef: 'Ajuste de SEO (extra)', valor: 180, vencimento: '30/06/2026', status: 'atrasado', ordem: 2 },
  { mesRef: 'Junho 2026', valor: 249, vencimento: '12/06/2026', status: 'pago', pagoEm: '12/06/2026', ordem: 3 },
  { mesRef: 'Maio 2026', valor: 249, vencimento: '11/05/2026', status: 'pago', pagoEm: '11/05/2026', ordem: 4 },
  { mesRef: 'Abril 2026', valor: 249, vencimento: '13/04/2026', status: 'pago', pagoEm: '13/04/2026', ordem: 5 },
];

async function seed() {
  if (cliente.uid === 'COLE_AQUI_O_UID') {
    console.error('⚠️  Substitua COLE_AQUI_O_UID pelo UID real do usuário antes de rodar.');
    process.exit(1);
  }

  const clienteRef = doc(db, 'clientes', 'marina');
  await setDoc(clienteRef, cliente);
  console.log('✔ Cliente criado: clientes/marina (' + cliente.nome + ')');

  for (const produto of produtos) {
    const ref = doc(collection(clienteRef, 'produtos'), 'produto-' + produto.ordem);
    await setDoc(ref, produto);
    console.log('✔ Produto criado: ' + produto.nome);
  }

  for (const fatura of faturas) {
    const ref = doc(collection(clienteRef, 'faturas'), 'fatura-' + fatura.ordem);
    await setDoc(ref, fatura);
    console.log('✔ Fatura criada: ' + fatura.mesRef);
  }

  console.log('\nSeed concluído.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
