import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

function useAsyncState(initialValue = [true, null]) {
  return useReducer(
    (state, action = null) => [false, action],
    initialValue
  );
}

export async function setStorageItemAsync(key, value) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key) {
  const [state, setState] = useAsyncState();

  useEffect(() => {
    const fetchStoredValue = async () => {
      try {
        let value = null;
        if (Platform.OS === 'web') {
          value = localStorage.getItem(key);
        } else {
          value = await SecureStore.getItemAsync(key);
        }
  
        setState(value ? JSON.parse(value) : null);
      } catch (e) {
        console.error("Error obteniendo el valor almacenado:", e);
      }
    };
  
    fetchStoredValue();
  }, [key]);
  

  const setValue = useCallback(
    (value) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}