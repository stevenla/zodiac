/**
 * Store state values into the hash, and update the hash when the state changes
 */
import {useState, useCallback} from 'react';

function getStoreInHash() {
  try {
    const hash = window.location.hash;
    const decoded = decodeURI(hash.slice(1));
    return JSON.parse(decoded) as {[key: string]: string};
  } catch (_) {
    return {};
  }
}

function getStoreValue(key: string): null | string {
  const store = getStoreInHash();
  const value = store[key];
  if (value == null) {
    return null;
  }
  return value;
}

function setStoreValue(key: string, value: string): void {
  const store = getStoreInHash();
  store[key] = value;
  console.log(store);
  window.location.hash = JSON.stringify(store);
}

function removeStoreValue(key: string): void {
  const store = getStoreInHash();
  delete store[key];
  window.location.hash = JSON.stringify(store);
}

export default function useStoredState<T>(
  name: string,
  key: string,
  serializer: (val: T) => string = JSON.stringify,
  deserializer: (val: string) => T = JSON.parse,
): [null | T, (val: null | T) => any] {
  const storageKey = `${name}-${key}`;
  const [value, setter] = useState<null | T>(() => {
    const storedValue = getStoreValue(storageKey);
    if (storedValue == null) {
      return null;
    }
    const storage = deserializer(storedValue) as T;
    return storage;
  });
  const storageSetter = useCallback(
    (val: null | T) => {
      if (val == null) {
        removeStoreValue(storageKey);
      } else {
        setStoreValue(storageKey, serializer(val));
      }
      setter(val);
    },
    [serializer, storageKey],
  );
  return [value, storageSetter];
}
