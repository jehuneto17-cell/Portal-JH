# Portal JH

## Visão geral

App mobile que funciona como **portal de clientes de um desenvolvedor**. O cliente
faz login, vê os produtos/serviços que eu mantenho pra ele (site, loja virtual, app)
e paga a mensalidade via **Mercado Pago**.

Estado atual: autenticação (login por e-mail/senha) e navegação por abas funcionando;
**as quatro telas (Início, Produtos, Faturas e Perfil) leem dados reais do Firestore**
via `ClienteContext` (o cliente cujo campo `uid` == usuário logado), fiéis ao design de
referência do claude.ai/design. O visual é idêntico ao que era com mock — só a fonte dos
dados mudou. O "Sair" do Perfil funciona de verdade (signOut). Integração com Mercado Pago
ainda não existe — próximo passo. Existe `scripts/seed.js` para popular o Firestore com o
cliente de teste (Marina) usando os mesmos dados que os mocks exibiam.

## Stack

| Camada | Escolha |
| --- | --- |
| App | React Native + Expo (managed workflow), **JavaScript** |
| Navegação | React Navigation (native-stack + bottom-tabs) |
| Backend | Firebase — Auth (e-mail/senha) + Firestore |
| Sessão | `initializeAuth` com `getReactNativePersistence(AsyncStorage)` |
| Fontes | Space Grotesk + Inter (`@expo-google-fonts`, carregadas com `expo-font`) |
| Ícones | Feather (`@expo/vector-icons`) |
| Pagamentos | Mercado Pago (ainda não integrado) |

Rodar: `npx expo start`.

## Estrutura de pastas

```
App.js                          carrega fontes, monta providers e o NavigationContainer
src/
  theme/index.js                C (cores), fonts, type, space, radius
  config/firebase.js            initializeApp + auth (persistência) + db; exporta auth e db
  context/AuthContext.js        { user, loading, signIn(email, senha), signOut() }
  context/ClienteContext.js     { cliente, produtos, faturas, loading, error, reload() };
                                busca o cliente por uid ao logar; envolve as abas (só roda
                                logado, montado no TabsNavigator)
  services/
    clienteService.js           leituras do Firestore: getClienteByUid(uid) (where uid ==,
                                limit 1), getProdutos(id) e getFaturas(id) (orderBy `ordem`)
    clientePresenter.js         adapta os dados crus do Firestore ao formato que as telas
                                já esperavam do mock: iconePorTipo, formatarValor,
                                formatarTotalEmAberto, iniciaisDoNome, subtituloFatura,
                                estaEmAberto, totalEmAberto, proximaFatura
  navigation/
    RootNavigator.js            user null -> Login; senão -> Tabs (headerShown false)
    TabsNavigator.js            Início | Produtos | Faturas | Perfil (dentro do ClienteProvider)
  screens/
    LoginScreen.js              funcional (e-mail, senha, loading, erros em português)
    HomeScreen.js               Firestore via ClienteContext: marca+sino, saudação
                                (1º nome + empresa), card da próxima fatura (pendente/
                                atrasada mais próxima; B escura se atrasada), atalhos com
                                contagem real e lista "Seus produtos"
    ProductsScreen.js           Firestore: título, subtítulo e cards de produto (ícone por
                                tipo, nome, tipo, StatusBadge, URL + "Abrir")
    InvoicesScreen.js           Firestore: resumo escuro (total em aberto = soma pendentes+
                                atrasadas), filtros Todas|Pendentes|Pagas e cards de fatura
                                (ícone de status, mesRef, valor, badge, "Pagar")
    ProfileScreen.js            Firestore: avatar (iniciais do nome)+nome+empresa, dados da
                                conta, ajuda via WhatsApp, opções e "Sair" (signOut real)
  components/
    Button.js                   variantes 'primary' | 'ghost', ícone opcional, loading,
                                textColor opcional (ex.: "Sair" ghost com texto vermelho)
    Card.js                     variantes 'light' | 'dark'
    Input.js                    borda, ícone opcional, outlineStyle 'none'
    StatusBadge.js              faturas: pago | pendente | atrasado | pausado
                                produtos: ativo | dev (usa type.badge, caixa normal)
    TelaEstado.js               <TelaCarregando/> (ActivityIndicator central) e
                                <TelaMensagem texto/> para loading/erro nas telas
scripts/seed.js                 popula o Firestore com o cliente de teste (Marina) e as
                                subcoleções produtos/faturas; rodar com `node scripts/seed.js`
assets/jh-logo.png              monograma JH (importado do projeto de design)
```

Design de referência (claude.ai/design): projeto `9af99ff8-758a-4b97-9b4e-7f99855724ce`,
arquivo `Portal JH.dc.html` — é web/HTML, serve só como referência visual.

## Regras do projeto (valem pra sempre)

1. **JavaScript/JSX — nunca TypeScript.**
2. **Nunca hardcodar cor ou fonte.** Tudo vem do tema: `C.primary`, `type.h1`, `space.lg`,
   `radius.card`. O único arquivo com valores hex/nomes de fonte literais é
   `src/theme/index.js`. Precisou de um token novo? Adicione ao tema, não à tela.
3. **Todo `TextInput` leva `outlineStyle: 'none'`** (já embutido no `Input`; use o
   componente em vez de um `TextInput` cru).
4. **Navegação pós-login usa `navigation.reset`** — nunca `navigate`/`push` para uma tela
   autenticada, para não deixar o Login no histórico. Hoje o `RootNavigator` troca de
   stack em função do `user` do `AuthContext` (o Login é desmontado sozinho, então não há
   `reset` explícito no código); assim que existir um fluxo em stack que precise pular
   para uma rota depois de autenticar, use `navigation.reset`.
5. **Textos de interface em português**, incluindo mensagens de erro (nada de repassar o
   `error.code` do Firebase cru pro usuário).

## Design tokens (resumo)

- **Cores**: primária `C.primary` (vermelho `#D42027`), superfícies clara/escura, e quatro
  pares bg/text de status — success (pago/ativo), warning (pendente/em dev), danger
  (atrasado) e paused (pausado). Valores alinhados aos tokens do design de referência.
- **Tipografia**: Space Grotesk para títulos (`display`, `h1`, `h2`) **e botões**
  (`button`); Inter para o resto (`label`, `body`, `bodyMed`, `caption`, `badge`).
  `label` é uppercase com letter-spacing; `badge` é caixa normal (pílulas de status).
- **Espaçamento**: `xs 4` → `xxxl 32`. **Raio**: `sm 8`, `md 12`, `card 14`,
  `cardLg 16` (card de destaque), `pill 999`.

## Histórico

| Data | O que foi feito |
| --- | --- |
| 2026-07-13 | Fundação: projeto Expo, tema, Firebase, navegação por abas e componentes base |
| 2026-07-14 | SDK fixado em 56 (compatível com Expo Go da loja); Auth condicional por plataforma (web usa `getAuth`) |
| 2026-07-14 | Tema alinhado aos tokens do design de referência (status, `textMutedDark`, botão em Space Grotesk, `type.badge`, `radius.cardLg`); tela de Início implementada com dados mocados (marca+sino, saudação, card da próxima fatura A/B, atalhos, "Seus produtos"); logo JH importado |
| 2026-07-14 | Tela de Produtos implementada com dados mocados, fiel ao design (cards com ícone, nome, tipo, StatusBadge e rodapé URL + chip "Abrir" sem ação); token `C.divider` adicionado ao tema |
| 2026-07-14 | Tela de Faturas implementada com dados mocados, fiel ao design: resumo escuro do total em aberto, filtros funcionais (Todas/Pendentes/Pagas) e cards com ícone de status, valor, StatusBadge e botão "Pagar" nas faturas em aberto; token `C.surfaceOnDark` adicionado |
| 2026-07-14 | Tela de Perfil implementada, fiel ao design: avatar com iniciais, nome/empresa, card de dados da conta (plano, e-mail, telefone, cliente desde), card de ajuda com botão WhatsApp (ação liga depois), opções (Notificações, Alterar senha) e "Sair" chamando o signOut real; token `C.textFaint` e prop `textColor` no Button |
| 2026-07-17 | `scripts/seed.js` para popular o Firestore com o cliente de teste (Marina) e as subcoleções produtos/faturas, com os mesmos dados dos mocks |
| 2026-07-17 | Botões "Pagar" conectados à API de MP em produção; ao clicar, abre o Checkout Pro do Mercado Pago. `services/pagamentoService.js` (`API_BASE_URL` + `criarCobranca({ fatura, cliente })`); HomeScreen (card da próxima fatura) e InvoicesScreen (faturas em aberto) com loading no botão clicado, `Linking.openURL(initPoint)` e `Alert` em erro. Visual inalterado. Verificado com `expo export` |
| 2026-07-17 | API de pagamento no MP (Checkout Pro) preparada — endpoints `/api/criar-cobranca` e `/api/webhook-mp` (placeholder). Pasta `api/` (formato Vercel serverless), `vercel.json` (runtime nodejs20.x) e `.env.example`. Access Token só via `process.env.MP_ACCESS_TOKEN`; CORS liberado; ainda não conectado ao botão Pagar |
| 2026-07-17 | Integração das 4 telas com o Firestore via `ClienteContext` (busca o cliente por `uid` e carrega produtos/faturas); services `clienteService` (leituras) e `clientePresenter` (adapta os dados crus ao formato dos mocks, então o visual não mudou); `TelaEstado` para loading (ActivityIndicator) e mensagem amigável quando o uid não tem cliente vinculado. Verificado com `expo export` (web + iOS) |
| 2026-07-19 | Deploy web (Expo Web) configurado na Vercel no mesmo projeto que hospeda `/api`: script `vercel-build` (`expo export -p web`) no `package.json`; `vercel.json` define `buildCommand`/`outputDirectory: dist` e rewrites (`/api/*` preservado como Serverless Functions, demais rotas caem no `index.html` do SPA). Nenhuma lógica de telas ou API alterada. Verificado com `npx expo export -p web` (gera `dist/` sem erros) e `npx serve dist` (HTML e bundle JS servidos com status 200) |
