import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getClienteByUid,
  getFaturas,
  getProdutos,
} from '../services/clienteService';
import { useAuth } from './AuthContext';

const ClienteContext = createContext(null);

const SEM_CLIENTE =
  'Não encontramos seus dados. Fale com a JH para vincular sua conta.';
const ERRO_CARREGAR =
  'Não foi possível carregar seus dados. Tente novamente.';

export function ClienteProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [cliente, setCliente] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async () => {
    if (!uid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clienteEncontrado = await getClienteByUid(uid);

      if (!clienteEncontrado) {
        setCliente(null);
        setProdutos([]);
        setFaturas([]);
        setError(SEM_CLIENTE);
        return;
      }

      const [produtosCliente, faturasCliente] = await Promise.all([
        getProdutos(clienteEncontrado.id),
        getFaturas(clienteEncontrado.id),
      ]);

      setCliente(clienteEncontrado);
      setProdutos(produtosCliente);
      setFaturas(faturasCliente);
    } catch (erro) {
      setCliente(null);
      setProdutos([]);
      setFaturas([]);
      setError(ERRO_CARREGAR);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const value = useMemo(
    () => ({
      cliente,
      produtos,
      faturas,
      loading,
      error,
      reload: carregar,
    }),
    [cliente, produtos, faturas, loading, error, carregar],
  );

  return (
    <ClienteContext.Provider value={value}>{children}</ClienteContext.Provider>
  );
}

export function useCliente() {
  const context = useContext(ClienteContext);

  if (!context) {
    throw new Error('useCliente precisa estar dentro de um ClienteProvider');
  }

  return context;
}
