import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClienteProvider } from '../context/ClienteContext';
import HomeScreen from '../screens/HomeScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { C, fonts, space } from '../theme';

const Tab = createBottomTabNavigator();

const ICONES = {
  Inicio: 'home',
  Produtos: 'grid',
  Faturas: 'file-text',
  Perfil: 'user',
};

// Altura base da tab bar (ícone + label + respiros), sem contar a safe area.
const ALTURA_BASE_TAB_BAR = 56;

export default function TabsNavigator() {
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom + space.sm;

  return (
    <ClienteProvider>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: {
          backgroundColor: C.bg,
          borderTopColor: C.border,
          height: ALTURA_BASE_TAB_BAR + paddingBottom,
          paddingBottom,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.inter500,
          fontSize: 11,
        },
        tabBarItemStyle: {
          paddingTop: space.xs,
        },
        tabBarIcon: ({ color, size }) => (
          <Feather name={ICONES[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen name="Produtos" component={ProductsScreen} />
      <Tab.Screen name="Faturas" component={InvoicesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </ClienteProvider>
  );
}
