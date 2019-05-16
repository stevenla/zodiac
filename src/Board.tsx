import React from 'react';
import archerData from './data/archer.json';
import { StyleSheet, Job } from './types';
import { Cell } from './Cell';

interface BoardProps {
  job: Job;
}

function getBoard(job: Job) {
  switch (job) {
    case Job.Archer:
      return archerData;
    default:
      throw new Error(`Unknown job ${job}`);
  }
}

export const Board: React.FC<BoardProps> = ({ job }) => {
  return (
    <div style={styles.board}>
      {getBoard(job).map(row => (
        <div style={styles.row}>
          {row.map(cell => (
            <Cell id={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

const styles: StyleSheet = {
  board: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  }
};
