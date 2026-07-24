import { Feather } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { TelaCarregando, TelaMensagem } from '../components/TelaEstado';
import { useCliente } from '../context/ClienteContext';
import { formatarValorProduto, iconePorTipo } from '../services/clientePresenter';
import { C, radius, space, type } from '../theme';

function CardProduto({ produto }) {
  return (
    <Card style={styles.cardProduto}>
      <View style={styles.linhaPrincipal}>
        <View style={styles.icone}>
          <Feather name={iconePorTipo(produto.tipo)} size={22} color={C.text} />
        </View>
        <View style={styles.info}>
          <Text style={[type.bodyMed, styles.nome]}>{produto.nome}</Text>
          <Text style={[type.caption, styles.tipo]}>{produto.tipo}</Text>
        </View>
        <View style={styles.ladoDireito}>
          <StatusBadge status={produto.status} />
          <Text style={[type.caption, styles.valor]}>
            {formatarValorProduto(produto.valor)}
          </Text>
        </View>
      </View>

      <View style={styles.rodape}>
        <View style={styles.urlArea}>
          <Feather name="link" size={14} color={C.textMuted} />
          <Text style={[type.caption, styles.url]} numberOfLines={1}>
            {produto.url || '—'}
          </Text>
        </View>
        <Pressable
          onPress={() => {}}
          style={({ pressed }) => [
            styles.abrir,
            pressed && styles.abrirPressionado,
          ]}
        >
          <Feather name="external-link" size={14} color={C.text} />
          <Text style={[type.caption, styles.abrirTexto]}>Abrir</Text>
        </Pressable>
      </View>
    </Card>
  );
}

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const { cliente, produtos, loading, error } = useCliente();

  if (loading) {
    return <TelaCarregando />;
  }

  if (!cliente) {
    return <TelaMensagem texto={error} />;
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[
        styles.conteudo,
        { paddingTop: insets.top + space.md },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[type.h1, styles.titulo]}>Meus Produtos</Text>
      <Text style={[type.body, styles.subtitulo]}>
        Serviços que a JH mantém para você.
      </Text>

      <View style={styles.lista}>
        {produtos.map((produto) => (
          <CardProduto key={produto.id} produto={produto} />
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
  subtitulo: {
    color: C.textMuted,
    marginTop: space.xs,
  },
  lista: {
    gap: space.md,
    marginTop: space.xl,
  },
  cardProduto: {
    padding: space.lg,
  },
  linhaPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  icone: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nome: {
    color: C.text,
  },
  tipo: {
    color: C.textMuted,
  },
  ladoDireito: {
    alignItems: 'flex-end',
    gap: space.xs,
  },
  valor: {
    color: C.textMuted,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    marginTop: space.md + 2,
    paddingTop: space.md + 2,
    borderTopWidth: 1,
    borderTopColor: C.divider,
  },
  urlArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
    minWidth: 0,
  },
  url: {
    color: C.textMuted,
    flexShrink: 1,
  },
  abrir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: radius.sm + 1,
    paddingVertical: space.sm - 1,
    paddingHorizontal: space.md,
    backgroundColor: C.bg,
  },
  abrirPressionado: {
    backgroundColor: C.surface,
  },
  abrirTexto: {
    color: C.text,
  },
});
