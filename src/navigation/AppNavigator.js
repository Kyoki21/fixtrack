import React from 'react';
import { Pressable } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import Avatar from '../components/Avatar';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import NewOrderScreen from '../screens/NewOrderScreen';
import ClientsScreen from '../screens/ClientsScreen';
import StatsScreen from '../screens/StatsScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS = {
  Home: ['home', 'home-outline'],
  Orders: ['list', 'list-outline'],
  NewOrder: ['add-circle', 'add-circle-outline'],
  Clients: ['people', 'people-outline'],
  Stats: ['stats-chart', 'stats-chart-outline'],
};

function Tabs() {
  const { theme, t, scale, fontFamily } = useSettings();
  const titles = {
    Home: 'FixTrack',
    Orders: t('ordersTitle'),
    NewOrder: t('newOrder'),
    Clients: t('clientsTitle'),
    Stats: t('statsTitle'),
  };
  const labels = {
    Home: t('tabHome'),
    Orders: t('tabOrders'),
    NewOrder: t('tabNew'),
    Clients: t('tabClients'),
    Stats: t('tabStats'),
  };

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: { backgroundColor: theme.card },
        headerTitleStyle: { color: theme.text, fontWeight: '800', fontFamily },
        headerShadowVisible: false,
        title: titles[route.name],
        tabBarLabel: labels[route.name],
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.sub,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        tabBarLabelStyle: { fontSize: 10 * scale, fontFamily },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
        headerRight: () => (
          <Pressable onPress={() => navigation.navigate('Profile')} style={{ marginRight: 14 }}>
            <Avatar size={34} />
          </Pressable>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="NewOrder" component={NewOrderScreen} />
      <Tab.Screen name="Clients" component={ClientsScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme, t, fontFamily } = useSettings();
  const base = theme.dark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.primary,
      background: theme.bg,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  };
  const headerOptions = {
    headerStyle: { backgroundColor: theme.card },
    headerTintColor: theme.primary,
    headerTitleStyle: { color: theme.text, fontFamily },
    headerShadowVisible: false,
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: t('orderDetails') }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
