// Tokens de design do Portal JH.
// Nenhuma cor ou fonte deve ser escrita direto nas telas/componentes: tudo sai daqui.

export const C = {
  bg: '#FFFFFF',
  surface: '#FAFAFA',
  surfaceDark: '#141414',
  surfaceOnDark: 'rgba(255,255,255,0.08)', // container sutil sobre fundo escuro

  text: '#141414',
  textOnDark: '#FFFFFF',
  textMuted: '#6E6E6E',
  textMutedDark: '#9A9A9A',
  textFaint: '#C4C4C4', // chevrons, rodapé de versão

  border: '#E8E8E8',
  divider: '#F0F0F0', // separador interno de cards, mais suave que a borda

  primary: '#D42027',
  primaryPressed: '#B81C22',
  onPrimary: '#FFFFFF',

  successBg: '#EAF5EF',
  successText: '#2F8F5E',

  warningBg: '#FBF3E3',
  warningText: '#B67A1A',

  dangerBg: '#FBEAEA',
  dangerText: '#D42027',

  pausedBg: '#F1F1F1',
  pausedText: '#6E6E6E',
};

export const fonts = {
  space500: 'SpaceGrotesk_500Medium',
  space600: 'SpaceGrotesk_600SemiBold',
  space700: 'SpaceGrotesk_700Bold',
  inter400: 'Inter_400Regular',
  inter500: 'Inter_500Medium',
  inter600: 'Inter_600SemiBold',
};

export const type = {
  display: { fontFamily: fonts.space700, fontSize: 40, lineHeight: 46 },
  h1: { fontFamily: fonts.space700, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: fonts.space600, fontSize: 20, lineHeight: 26 },
  label: {
    fontFamily: fonts.inter600,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: { fontFamily: fonts.inter400, fontSize: 15, lineHeight: 22 },
  bodyMed: { fontFamily: fonts.inter500, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.inter400, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fonts.space600, fontSize: 16, lineHeight: 20 },
  // Pílulas de status: caixa normal (sem uppercase), diferente do `label`.
  badge: { fontFamily: fonts.inter600, fontSize: 12, lineHeight: 16 },
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  card: 14,
  cardLg: 16, // card de destaque (próxima fatura)
  pill: 999,
};
