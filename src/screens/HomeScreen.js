import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
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
  formatarTotalEmAberto,
  formatarValor,
  iconePorTipo,
  proximaFatura,
  totalEmAberto,
} from '../services/clientePresenter';
import { criarCobranca } from '../services/pagamentoService';
import { C, radius, space, type } from '../theme';

// A saudação usa só o primeiro nome do cliente (ex.: "Marina").
function primeiroNome(nome) {
  return nome?.trim().split(/\s+/)[0] ?? '';
}

function CantosMonograma() {
  // Cantos do monograma JH: L preto no topo-esquerdo, L vermelho embaixo-direito.
  return (
    <>
      <View style={styles.cantoTopo} />
      <View style={styles.cantoBaixo} />
    </>
  );
}

function CardProximaFatura({ fatura, cliente }) {
  const atrasada = fatura.status === 'atrasado';
  const [pagando, setPagando] = useState(false);

  async function handlePagar() {
    setPagando(true);
    try {
      const { initPoint } = await criarCobranca({ fatura, cliente });
      await Linking.openURL(initPoint);
    } catch (erro) {
      Alert.alert('Não foi possível gerar o pagamento', erro.message);
    } finally {
      setPagando(false);
    }
  }

  return (
    <Card
      variant={atrasada ? 'dark' : 'light'}
      style={[styles.cardFatura, atrasada && styles.cardFaturaEscuro]}
    >
      {atrasada ? (
        // Variação B: filete vermelho no canto superior direito.
        <>
          <View style={styles.fileteHorizontal} />
          <View style={styles.fileteVertical} />
        </>
      ) : (
        <CantosMonograma />
      )}

      <View style={styles.linhaFatura}>
        <Text
          style={[
            type.label,
            { color: atrasada ? C.textMutedDark : C.textMuted },
          ]}
        >
          Próxima fatura
        </Text>
        <StatusBadge status={fatura.status} />
      </View>

      <Text
        style={[
          type.display,
          styles.valorFatura,
          { color: atrasada ? C.textOnDark : C.text },
        ]}
      >
        {formatarValor(fatura.valor)}
      </Text>

      <View style={styles.linhaVencimento}>
        <Feather
          name="calendar"
          size={16}
          color={atrasada ? C.textMutedDark : C.textMuted}
        />
        <Text
          style={[
            type.body,
            { color: atrasada ? C.textMutedDark : C.textMuted },
          ]}
        >
          Vence em {fatura.vencimento}
        </Text>
      </View>

      <Button
        title="Pagar agora"
        icon="zap"
        onPress={handlePagar}
        loading={pagando}
        style={styles.botaoPagar}
      />
    </Card>
  );
}

function Atalho({ icone, titulo, subtitulo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.atalho, pressed && styles.atalhoPressionado]}
    >
      <View style={styles.atalhoIcone}>
        <Feather name={icone} size={20} color={C.text} />
      </View>
      <View>
        <Text style={[type.bodyMed, styles.atalhoTitulo]}>{titulo}</Text>
        <Text style={[type.caption, styles.atalhoSubtitulo]}>{subtitulo}</Text>
      </View>
    </Pressable>
  );
}

function LinhaProduto({ produto }) {
  return (
    <Card style={styles.produto}>
      <View style={styles.produtoIcone}>
        <Feather name={iconePorTipo(produto.tipo)} size={20} color={C.text} />
      </View>
      <View style={styles.produtoInfo}>
        <Text style={[type.bodyMed, styles.produtoNome]}>{produto.nome}</Text>
        <Text style={[type.caption, styles.produtoTipo]}>{produto.tipo}</Text>
      </View>
      <StatusBadge status={produto.status} />
    </Card>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cliente, produtos, faturas, loading, error } = useCliente();

  if (loading) {
    return <TelaCarregando />;
  }

  if (!cliente) {
    return <TelaMensagem texto={error} />;
  }

  const fatura = proximaFatura(faturas);
  const total = totalEmAberto(faturas);

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[
        styles.conteudo,
        { paddingTop: insets.top + space.sm },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Topo: marca + sino */}
      <View style={styles.topo}>
        <View style={styles.marca}>
          <Image
            source={require('../../assets/jh-logo.png')}
            style={styles.logo}
          />
          <Text style={[type.h2, styles.marcaTexto]}>JH</Text>
        </View>
        <Pressable style={styles.sino} onPress={() => {}}>
          <Feather name="bell" size={20} color={C.text} />
          <View style={styles.sinoPonto} />
        </Pressable>
      </View>

      {/* Saudação */}
      <View style={styles.saudacao}>
        <Text style={[type.h1, styles.ola]}>
          Olá, {primeiroNome(cliente.nome)}
        </Text>
        <Text style={[type.body, styles.empresa]}>{cliente.empresa}</Text>
      </View>

      {/* Próxima fatura */}
      {fatura ? <CardProximaFatura fatura={fatura} cliente={cliente} /> : null}

      {/* Atalhos */}
      <View style={styles.atalhos}>
        <Atalho
          icone="package"
          titulo="Meus produtos"
          subtitulo={`${produtos.length} serviços`}
          onPress={() => navigation.navigate('Produtos')}
        />
        <Atalho
          icone="file-text"
          titulo="Faturas"
          subtitulo={formatarTotalEmAberto(total)}
          onPress={() => navigation.navigate('Faturas')}
        />
      </View>

      {/* Seus produtos */}
      <View style={styles.secaoTopo}>
        <Text style={[type.h2, styles.secaoTitulo]}>Seus produtos</Text>
        <Pressable onPress={() => navigation.navigate('Produtos')}>
          <Text style={[type.bodyMed, styles.verTodos]}>Ver todos</Text>
        </Pressable>
      </View>
      <View style={styles.listaProdutos}>
        {produtos.slice(0, 2).map((produto) => (
          <LinhaProduto key={produto.id} produto={produto} />
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
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.sm,
  },
  marca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  marcaTexto: {
    color: C.text,
    letterSpacing: 2,
  },
  sino: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinoPonto: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: C.primary,
    borderWidth: 1.5,
    borderColor: C.bg,
  },
  saudacao: {
    marginTop: space.lg,
  },
  ola: {
    color: C.text,
  },
  empresa: {
    color: C.textMuted,
    marginTop: space.xs / 2,
  },
  cardFatura: {
    marginTop: space.xl,
    borderRadius: radius.cardLg,
    padding: space.xxl,
    overflow: 'hidden',
  },
  cardFaturaEscuro: {
    borderWidth: 0,
  },
  cantoTopo: {
    position: 'absolute',
    top: 11,
    left: 11,
    width: 17,
    height: 17,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: C.text,
  },
  cantoBaixo: {
    position: 'absolute',
    bottom: 11,
    right: 11,
    width: 17,
    height: 17,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: C.primary,
  },
  fileteHorizontal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 70,
    height: 4,
    backgroundColor: C.primary,
  },
  fileteVertical: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: 70,
    backgroundColor: C.primary,
  },
  linhaFatura: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valorFatura: {
    marginTop: space.md,
  },
  linhaVencimento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
    marginTop: space.xs,
  },
  botaoPagar: {
    marginTop: space.lg,
  },
  atalhos: {
    flexDirection: 'row',
    gap: space.md,
    marginTop: space.lg,
  },
  atalho: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: radius.card,
    padding: space.lg,
    gap: space.md,
  },
  atalhoPressionado: {
    backgroundColor: C.pausedBg,
  },
  atalhoIcone: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atalhoTitulo: {
    color: C.text,
  },
  atalhoSubtitulo: {
    color: C.textMuted,
    marginTop: 1,
  },
  secaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.xxl,
  },
  secaoTitulo: {
    color: C.text,
  },
  verTodos: {
    color: C.primary,
  },
  listaProdutos: {
    gap: space.sm + 2,
    marginTop: space.md,
  },
  produto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md + 1,
  },
  produtoIcone: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    color: C.text,
  },
  produtoTipo: {
    color: C.textMuted,
  },
});
