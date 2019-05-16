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

export function useStoredState<T>(
  name: string,
  key: string,
  serializer: (val: T) => string = JSON.stringify,
  deserializer: (val: string) => T = JSON.parse,
): [null | T, (val: null | T) => any] {
  // TODO: store in URL instead of local storage
  const storageKey = `zodiac-val-${name}-${key}`;
  const [value, setter] = useState<null | T>(() => {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue == null) {
      return null;
    }
    const storage = deserializer(storedValue) as T;
    return storage;
  });
  const storageSetter = useCallback(
    (val: null | T) => {
      if (val == null) {
        console.log(name, key);
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, serializer(val));
      }
      setter(val);
    },
    [name],
  );
  return [value, storageSetter];
}

const styles: StyleSheet = {};
