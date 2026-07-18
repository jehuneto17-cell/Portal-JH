import { Feather } from '@expo/vector-icons';
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
import { TelaCarregando, TelaMensagem } from '../components/TelaEstado';
import { useAuth } from '../context/AuthContext';
import { useCliente } from '../context/ClienteContext';
import { iniciaisDoNome } from '../services/clientePresenter';
import { C, radius, space, type } from '../theme';

function LinhaDado({ icone, rotulo, valor, ultima }) {
  return (
    <View style={[styles.linhaDado, !ultima && styles.linhaDadoDivisor]}>
      <View style={styles.dadoIcone}>
        <Feather name={icone} size={17} color={C.textMuted} />
      </View>
      <View style={styles.dadoTexto}>
        <Text style={[type.caption, styles.dadoRotulo]}>{rotulo}</Text>
        <Text style={[type.bodyMed, styles.dadoValor]}>{valor}</Text>
      </View>
    </View>
  );
}

function LinhaOpcao({ icone, rotulo, ultima, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.linhaOpcao,
        !ultima && styles.linhaDadoDivisor,
        pressed && styles.opcaoPressionada,
      ]}
    >
      <Feather name={icone} size={19} color={C.textMuted} />
      <Text style={[type.bodyMed, styles.opcaoTexto]}>{rotulo}</Text>
      <Feather name="chevron-right" size={19} color={C.textFaint} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { cliente, loading, error } = useCliente();

  if (loading) {
    return <TelaCarregando />;
  }

  if (!cliente) {
    return <TelaMensagem texto={error} />;
  }

  const dadosConta = [
    { icone: 'award', rotulo: 'Plano', valor: cliente.plano },
    { icone: 'mail', rotulo: 'E-mail', valor: cliente.email },
    { icone: 'phone', rotulo: 'Telefone', valor: cliente.whatsapp },
    { icone: 'calendar', rotulo: 'Cliente desde', valor: cliente.clienteDesde },
  ];

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[
        styles.conteudo,
        { paddingTop: insets.top + space.md },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[type.h1, styles.titulo]}>Perfil</Text>

      {/* Identificação do cliente */}
      <View style={styles.identidade}>
        <View style={styles.avatar}>
          <Text style={[type.h2, styles.avatarTexto]}>
            {iniciaisDoNome(cliente.nome)}
          </Text>
        </View>
        <View style={styles.identidadeTexto}>
          <Text style={[type.h2, styles.nome]}>{cliente.nome}</Text>
          <Text style={[type.caption, styles.empresa]}>
            {cliente.empresa}
          </Text>
        </View>
      </View>

      {/* Dados da conta */}
      <Card style={styles.cardDados}>
        {dadosConta.map((dado, indice) => (
          <LinhaDado
            key={dado.rotulo}
            {...dado}
            ultima={indice === dadosConta.length - 1}
          />
        ))}
      </Card>

      {/* Suporte via WhatsApp */}
      <Card style={styles.cardAjuda}>
        <Text style={[type.h2, styles.ajudaTitulo]}>Precisa de ajuda?</Text>
        <Text style={[type.caption, styles.ajudaSub]}>
          Fale direto com o suporte da JH pelo WhatsApp.
        </Text>
        <Pressable
          onPress={() => {}}
          style={({ pressed }) => [
            styles.botaoWhatsApp,
            pressed && styles.botaoWhatsAppPressionado,
          ]}
        >
          <Feather name="message-circle" size={19} color={C.onPrimary} />
          <Text style={[type.button, styles.botaoWhatsAppTexto]}>
            Falar no WhatsApp
          </Text>
        </Pressable>
      </Card>

      {/* Opções */}
      <Card style={styles.cardOpcoes}>
        <LinhaOpcao icone="bell" rotulo="Notificações" onPress={() => {}} />
        <LinhaOpcao
          icone="lock"
          rotulo="Alterar senha"
          ultima
          onPress={() => {}}
        />
      </Card>

      {/* Sair — chama o signOut de verdade; o RootNavigator volta pro Login */}
      <Button
        variant="ghost"
        title="Sair"
        icon="log-out"
        textColor={C.primary}
        onPress={signOut}
        style={styles.botaoSair}
      />

      <Text style={[type.caption, styles.versao]}>JH Portal · v1.0.0</Text>
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
    paddingBottom: space.xxxl,
  },
  titulo: {
    color: C.text,
  },
  identidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg - 1,
    marginTop: space.lg + 2,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: radius.pill,
    backgroundColor: C.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: C.textOnDark,
  },
  identidadeTexto: {
    flex: 1,
    minWidth: 0,
  },
  nome: {
    color: C.text,
  },
  empresa: {
    color: C.textMuted,
  },
  cardDados: {
    marginTop: space.xl,
    padding: 0,
    overflow: 'hidden',
  },
  linhaDado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md + 1,
    paddingVertical: space.md + 2,
    paddingHorizontal: space.lg,
  },
  linhaDadoDivisor: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  dadoIcone: {
    width: 34,
    height: 34,
    borderRadius: radius.sm + 1,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dadoTexto: {
    flex: 1,
    minWidth: 0,
  },
  dadoRotulo: {
    color: C.textMutedDark,
  },
  dadoValor: {
    color: C.text,
  },
  cardAjuda: {
    marginTop: space.lg,
    backgroundColor: C.surface,
    padding: space.lg + 2,
  },
  ajudaTitulo: {
    color: C.text,
  },
  ajudaSub: {
    color: C.textMuted,
    marginTop: space.xs - 1,
  },
  botaoWhatsApp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: C.successText,
    marginTop: space.md + 2,
  },
  botaoWhatsAppPressionado: {
    opacity: 0.9,
  },
  botaoWhatsAppTexto: {
    color: C.onPrimary,
    fontSize: type.bodyMed.fontSize,
  },
  cardOpcoes: {
    marginTop: space.lg,
    padding: 0,
    overflow: 'hidden',
  },
  linhaOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md + 1,
    paddingVertical: space.md + 2,
    paddingHorizontal: space.lg,
  },
  opcaoPressionada: {
    backgroundColor: C.surface,
  },
  opcaoTexto: {
    flex: 1,
    color: C.text,
  },
  botaoSair: {
    marginTop: space.lg,
    height: 50,
  },
  versao: {
    textAlign: 'center',
    color: C.textFaint,
    marginTop: space.lg,
  },
});
