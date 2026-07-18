import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyChykr7CnbYCxcot3THO1wocx9q2FFiqyU',
  authDomain: 'jh-cobranca.firebaseapp.com',
  projectId: 'jh-cobranca',
  storageBucket: 'jh-cobranca.firebasestorage.app',
  messagingSenderId: '886291146836',
  appId: '1:886291146836:web:2d557e8ea649f8267ee5c1',
};

const app = initializeApp(firebaseConfig);

// No web a persistência é automática (browser); getReactNativePersistence só existe
// no Firebase nativo. Em iOS/Android usamos AsyncStorage para manter a sessão.
export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const db = getFirestore(app);
