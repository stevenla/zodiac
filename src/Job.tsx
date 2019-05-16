import React, {useState, useCallback} from 'react';
import {Job} from './types';
import {StyleSheet} from './styles';

interface JobSelectorProps {
  value: null | Job;
  onChange: (job: null | Job) => any;
}

export const JobSelector: React.FC<JobSelectorProps> = ({value, onChange}) => {
  return (
    <select
      value={value || undefined}
      onChange={e => {
        const value = e.target.value;
        if (value === 'None') {
          onChange(null);
        } else {
          onChange(e.target.value as Job);
        }
      }}>
      <option value="None">None</option>
      <option value={Job.Archer}>Archer</option>
      <option value={Job.BlackMage}>Black Mage</option>
      <option value={Job.Bushi}>Bushi</option>
      <option value={Job.Foebreaker}>Foebreaker</option>
      <option value={Job.Knight}>Knight</option>
      <option value={Job.Machinist}>Machinist</option>
      <option value={Job.Monk}>Monk</option>
      <option value={Job.RedBattlemage}>Red Battlemage</option>
      <option value={Job.Shikari}>Shikari</option>
      <option value={Job.TimeBattlemage}>Time Battlemage</option>
      <option value={Job.Uhlan}>Uhlan</option>
      <option value={Job.WhiteMage}>White Mage</option>
    </select>
  );
};

function getStoreInHash() {
  try {
    const hash = window.location.hash;
    console.log(decodeURI(hash.slice(1)));
    return JSON.parse(decodeURI(hash.slice(1))) as {[key: string]: string};
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

export function useStoredState<T>(
  name: string,
  key: string,
  serializer: (val: T) => string = JSON.stringify,
  deserializer: (val: string) => T = JSON.parse,
): [null | T, (val: null | T) => any] {
  // TODO: store in URL instead of local storage
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
    [name],
  );
  return [value, storageSetter];
}

const styles: StyleSheet = {};
