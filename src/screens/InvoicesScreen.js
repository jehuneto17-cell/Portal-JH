import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { TelaCarregando, TelaMensagem } from '../components/TelaEstado';
import { useCliente } from '../context/ClienteContext';
import {
  estaEmAberto,
  formatarValor,
  subtituloFatura,
  totalEmAberto,
} from '../services/clientePresenter';
import { C, radius, space, type } from '../theme';

const ICONE_STATUS = {
  pago: 'check-circle',
  pendente: 'clock',
  atrasado: 'alert-circle',
};

const COR_STATUS = {
  pago: { bg: C.successBg, color: C.successText },
  pendente: { bg: C.warningBg, color: C.warningText },
  atrasado: { bg: C.dangerBg, color: C.dangerText },
};

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendentes', label: 'Pendentes' },
  { id: 'pagas', label: 'Pagas' },
];

function filtrar(faturas, filtro) {
  if (filtro === 'pendentes') {
    return faturas.filter((f) => f.status === 'pendente' || f.status === 'atrasado');
  }
  if (filtro === 'pagas') {
    return faturas.filter((f) => f.status === 'pago');
  }
  return faturas;
}

function CardFatura({ fatura }) {
  const cores = COR_STATUS[fatura.status];
  const emAberto = estaEmAberto(fatura);
  const valor = formatarValor(fatura.valor);

  return (
    <Card style={styles.cardFatura}>
      <View style={styles.linhaFatura}>
        <View style={styles.faturaEsquerda}>
          <View style={[styles.iconeStatus, { backgroundColor: cores.bg }]}>
            <Feather
              name={ICONE_STATUS[fatura.status]}
              size={20}
              color={cores.color}
            />
          </View>
          <View style={styles.faturaInfo}>
            <Text style={[type.bodyMed, styles.faturaTitulo]}>
              {fatura.mesRef}
            </Text>
            <Text style={[type.caption, styles.faturaSub]}>
              {subtituloFatura(fatura)}
            </Text>
          </View>
        </View>
        <View style={styles.faturaDireita}>
          <Text style={[type.bodyMed, styles.faturaValor]}>{valor}</Text>
          <StatusBadge status={fatura.status} style={styles.faturaBadge} />
        </View>
      </View>

      {emAberto ? (
        <Button
          title={`Pagar ${valor}`}
          onPress={() => {}}
          style={styles.botaoPagar}
        />
      ) : null}
    </Card>
  );
}

export default function InvoicesScreen() {
  const insets = useSafeAreaInsets();
  const [filtro, setFiltro] = useState('todas');
  const { cliente, faturas: todasFaturas, loading, error } = useCliente();

  if (loading) {
    return <TelaCarregando />;
  }

  if (!cliente) {
    return <TelaMensagem texto={error} />;
  }

  const faturas = filtrar(todasFaturas, filtro);
  const emAberto = todasFaturas.filter(estaEmAberto);
  const totalAberto = totalEmAberto(todasFaturas);

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[
        styles.conteudo,
        { paddingTop: insets.top + space.md },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[type.h1, styles.titulo]}>Faturas</Text>

      {/* Resumo: total em aberto */}
      <Card variant="dark" style={styles.resumo}>
        <View style={styles.resumoTexto}>
          <Text style={[type.caption, styles.resumoLegenda]}>
            Total em aberto · {emAberto.length} faturas
          </Text>
          <Text style={[type.h1, styles.resumoValor]}>
            {formatarValor(totalAberto)}
          </Text>
        </View>
        <View style={styles.resumoIcone}>
          <Feather name="credit-card" size={22} color={C.textOnDark} />
        </View>
      </Card>

      {/* Filtros */}
      <View style={styles.filtros}>
        {FILTROS.map((f) => {
          const ativo = filtro === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFiltro(f.id)}
              style={[styles.filtro, ativo && styles.filtroAtivo]}
            >
              <Text
                style={[
                  type.badge,
                  ativo ? styles.filtroTextoAtivo : styles.filtroTexto,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Lista */}
      <View style={styles.lista}>
        {faturas.map((fatura) => (
          <CardFatura key={fatura.id} fatura={fatura} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: C.bg,
  },
  conteudo: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xxl,
  },
  titulo: {
    color: C.text,
  },
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.lg,
    paddingVertical: space.lg,
    paddingHorizontal: space.lg + 2,
  },
  resumoTexto: {
    flex: 1,
    minWidth: 0,
  },
  resumoLegenda: {
    color: C.textMutedDark,
  },
  resumoValor: {
    color: C.textOnDark,
    marginTop: space.xs - 1,
  },
  resumoIcone: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: C.surfaceOnDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtros: {
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.lg,
  },
  filtro: {
    paddingVertical: space.sm - 1,
    paddingHorizontal: space.lg - 2,
    borderRadius: radius.pill,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  filtroAtivo: {
    backgroundColor: C.surfaceDark,
    borderColor: C.surfaceDark,
  },
  filtroTexto: {
    color: C.textMuted,
  },
  filtroTextoAtivo: {
    color: C.textOnDark,
  },
  lista: {
    gap: space.md,
    marginTop: space.lg,
  },
  cardFatura: {
    padding: space.lg,
  },
  linhaFatura: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
  },
  faturaEsquerda: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minWidth: 0,
  },
  iconeStatus: {
    width: 40,
    height: 40,
    borderRadius: radius.md - 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faturaInfo: {
    flex: 1,
    minWidth: 0,
  },
  faturaTitulo: {
    color: C.text,
  },
  faturaSub: {
    color: C.textMuted,
  },
  faturaDireita: {
    alignItems: 'flex-end',
  },
  faturaValor: {
    color: C.text,
  },
  faturaBadge: {
    marginTop: space.xs + 2,
  },
  botaoPagar: {
    marginTop: space.md + 2,
    height: 46,
  },
});
