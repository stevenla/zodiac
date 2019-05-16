import React from 'react';
import {Job} from './types';
import {Cell} from './Cell';
import {StyleSheet} from './styles';
import {LicenseId} from './License';

interface BoardProps {
  licenses: Set<LicenseId>;
  job: Job;
  onClick: (id: LicenseId) => any;
}

export function getBoard(job: Job): Array<Array<null | string>> {
  switch (job) {
    case Job.Archer:
      return require('./data/archer.json');
    case Job.Shikari:
      return require('./data/shikari.json');
    case Job.Machinist:
      return require('./data/machinist.json');
    case Job.Monk:
      return require('./data/monk.json');
    case Job.Bushi:
      return require('./data/bushi.json');
    case Job.RedBattlemage:
      return require('./data/redbattlemage.json');
    case Job.WhiteMage:
      return require('./data/whitemage.json');
    case Job.BlackMage:
      return require('./data/blackmage.json');
    case Job.TimeBattlemage:
      return require('./data/timebattlemage.json');
    case Job.Uhlan:
      return require('./data/uhlan.json');
    case Job.Knight:
      return require('./data/knight.json');
    case Job.Foebreaker:
      return require('./data/foebreaker.json');
    default:
      throw new Error(`Unknown job ${job}`);
  }
}

export const Board: React.FC<BoardProps> = ({licenses, job, onClick}) => {
  return (
    <div style={styles.board}>
      {getBoard(job).map((row, rowIndex) => (
        <div key={rowIndex} style={styles.row}>
          {row.map((id, colIndex) => (
            <Cell
              onClick={onClick}
              key={colIndex}
              id={id}
              active={licenses.has(id as LicenseId)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const styles: StyleSheet = {
  board: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
};
