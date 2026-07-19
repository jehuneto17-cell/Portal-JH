import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { C, space, type } from '../theme';

const MENSAGENS_ERRO = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-disabled': 'Esta conta está desativada. Fale com o suporte.',
  'auth/too-many-requests':
    'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed':
    'Sem conexão. Verifique sua internet e tente de novo.',
};

export default function LoginScreen() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleEntrar() {
    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      await signIn(email, senha);
      // A navegação acontece sozinha: o RootNavigator troca de stack quando o user muda.
    } catch (error) {
      setErro(
        MENSAGENS_ERRO[error.code] ??
          'Não foi possível entrar. Tente novamente.',
      );
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space.xxxl, paddingBottom: insets.bottom + space.xxxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/jh-logo.png')}
            style={styles.logo}
          />
          <Text style={[type.label, styles.eyebrow]}>Portal JH</Text>
          <Text style={[type.h1, styles.titulo]}>Bem-vindo de volta</Text>
          <Text style={[type.body, styles.subtitulo]}>
            Entre para acompanhar seus produtos e faturas.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            icon="mail"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            editable={!carregando}
          />

          <Input
            icon="lock"
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            editable={!carregando}
            onSubmitEditing={handleEntrar}
            returnKeyType="go"
          />

          {erro ? (
            <Text style={[type.caption, styles.erro]}>{erro}</Text>
          ) : null}

          <Button title="Entrar" onPress={handleEntrar} loading={carregando} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
  },
  header: {
    marginBottom: space.xxxl,
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: space.lg,
  },
  eyebrow: {
    color: C.primary,
    marginBottom: space.md,
  },
  titulo: {
    color: C.text,
    marginBottom: space.sm,
  },
  subtitulo: {
    color: C.textMuted,
  },
  form: {
    gap: space.md,
  },
  erro: {
    color: C.dangerText,
  },
});
