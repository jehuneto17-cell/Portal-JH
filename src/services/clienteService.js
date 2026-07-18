import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';

// Busca o cliente cujo campo `uid` bate com o usuário autenticado.
// Retorna { id, ...dados } ou null se não houver cliente vinculado.
export async function getClienteByUid(uid) {
  try {
    const q = query(
      collection(db, 'clientes'),
      where('uid', '==', uid),
      limit(1),
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (erro) {
    console.error('getClienteByUid:', erro);
    throw erro;
  }
}

// Lê clientes/{clienteId}/produtos ordenado por `ordem`.
export async function getProdutos(clienteId) {
  try {
    const q = query(
      collection(db, 'clientes', clienteId, 'produtos'),
      orderBy('ordem'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (erro) {
    console.error('getProdutos:', erro);
    throw erro;
  }
}

// Lê clientes/{clienteId}/faturas ordenado por `ordem`.
export async function getFaturas(clienteId) {
  try {
    const q = query(
      collection(db, 'clientes', clienteId, 'faturas'),
      orderBy('ordem'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (erro) {
    console.error('getFaturas:', erro);
    throw erro;
  }
}
