import React from 'react';
import {Job} from './types';

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
