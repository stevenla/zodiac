import React, {useState, useCallback} from 'react';
import {Board} from './Board';
import {Job} from './types';
import {StyleSheet} from './styles';
import {LicenseId} from './License';

interface CharacterData {
  jobs: [Job, Job];
  summons: Array<LicenseId>;
  quickenings: Array<LicenseId>;
}

interface JobSelectorProps {
  value: null | Job;
  onChange: (job: null | Job) => any;
}
const JobSelector: React.FC<JobSelectorProps> = ({value, onChange}) => {
  return (
    <select
      value={value || undefined}
      onChange={e => {
        const value = e.target.value;
        if (value === 'None') {
          onChange(null);
        } else {
          onChange(Number(e.target.value));
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
      <option value={Job.WhiteMage}>WhiteMage</option>
    </select>
  );
};

function useJob(name: string): [null | Job, (job: null | Job) => any] {
  const storageKey = `zodiac-job-${name}`;
  const [value, setter] = useState<null | Job>(() => {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue == null) {
      return null;
    }
    const storage = JSON.parse(storedValue) as Job;
    return storage;
  });
  const storageSetter = useCallback(
    (job: null | Job) => {
      if (job == null) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(job));
      }
      setter(job);
    },
    [name],
  );
  return [value, storageSetter];
}

interface CharacterProps {
  name: string;
}
export const Character: React.FC<CharacterProps> = ({name}) => {
  const [job1, setJob1] = useJob(name + '1');
  const [job2, setJob2] = useJob(name + '2');
  return (
    <div style={styles.root}>
      <h2 style={styles.title}>{name}</h2>
      <div style={styles.row}>
        <div>
          <JobSelector value={job1} onChange={setJob1} />
          {job1 != null && (
            <div style={styles.board}>
              <Board job={job1} />
            </div>
          )}
        </div>
        <div>
          <JobSelector value={job2} onChange={setJob2} />
          {job2 != null && (
            <div style={styles.board}>
              <Board job={job2} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: StyleSheet = {
  root: {},
  row: {
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  board: {
    marginRight: 24,
  },
};
