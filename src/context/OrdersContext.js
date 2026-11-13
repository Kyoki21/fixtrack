import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { KEYS, loadJson, saveJson } from '../storage/storage';

export const STATUSES = ['inProgress', 'waiting', 'ready'];

export const seedOrders = [
  { id: 78912, device: 'Samsung S23', service: 'Замена экрана', client: 'Ольга П.', phone: '+7 701 111 22 33', status: 'inProgress', date: '16.05.2024', note: '' },
  { id: 78913, device: 'iPhone 14 Pro', service: 'Замена аккумулятора', client: 'Андрей К.', phone: '+7 702 222 33 44', status: 'inProgress', date: '16.05.2024', note: '' },
  { id: 78914, device: 'iPhone 14 Pro', service: 'Чистка от влаги', client: 'Сергей В.', phone: '+7 705 333 44 55', status: 'waiting', date: '17.05.2024', note: 'Ждём шлейф' },
  { id: 78915, device: 'Xiaomi 13T', service: 'Замена аккумулятора', client: 'Сергей В.', phone: '+7 705 333 44 55', status: 'waiting', date: '17.05.2024', note: '' },
  { id: 78916, device: 'Xiaomi 13T', service: 'Чистка от влаги', client: 'Дана М.', phone: '+7 707 444 55 66', status: 'ready', date: '18.05.2024', note: 'Можно забирать' },
  { id: 78917, device: 'Samsung S23', service: 'Замена дисплея', client: 'Алия Н.', phone: '+7 777 555 66 77', status: 'ready', date: '15.05.2024', note: '' },
];

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return action.payload;
    case 'add': {
      const nextId = state.reduce((max, o) => Math.max(max, o.id), 78900) + 1;
      return [{ ...action.order, id: nextId }, ...state];
    }
    case 'status':
      return state.map((o) => (o.id === action.id ? { ...o, status: action.status } : o));
    case 'remove':
      return state.filter((o) => o.id !== action.id);
    default:
      return state;
  }
}

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, dispatch] = useReducer(reducer, seedOrders);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadJson(KEYS.orders, null).then((saved) => {
      if (saved) dispatch({ type: 'hydrate', payload: saved });
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveJson(KEYS.orders, orders);
  }, [orders, ready]);

  const value = useMemo(
    () => ({
      orders,
      addOrder: (order) => dispatch({ type: 'add', order }),
      setStatus: (id, status) => dispatch({ type: 'status', id, status }),
      removeOrder: (id) => dispatch({ type: 'remove', id }),
    }),
    [orders]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  return useContext(OrdersContext);
}
