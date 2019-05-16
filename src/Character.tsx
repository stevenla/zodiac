import React, {useMemo, useContext} from 'react';
import {Board, getBoard} from './Board';
import {Job} from './types';
import {StyleSheet} from './styles';
import {LicenseId, License} from './License';
import {JobSelector} from './Job';
import {EsperContext} from './App';
import useStoredState from './useStoredState';

function addQuickening(arr: LicenseId[], q: LicenseId): LicenseId[] {
  if (arr.length >= 3) {
    return arr;
  }
  return [...arr, q];
}

function removeQuickening(arr: LicenseId[], q: LicenseId): LicenseId[] {
  return arr.filter(v => v !== q);
}

function getAt(
  board: (string | null)[][],
  rowIndex: number,
  colIndex: number,
): LicenseId | null {
  const row = board[rowIndex];
  if (row == null) {
    return null;
  }
  return (row[colIndex] as LicenseId) || null;
}

function getAdjacents(
  board: (string | null)[][],
  id: LicenseId,
): Array<LicenseId> {
  const adjacents: LicenseId[] = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === id) {
        const up = getAt(board, rowIndex - 1, colIndex);
        if (up) adjacents.push(up);
        const down = getAt(board, rowIndex + 1, colIndex);
        if (down) adjacents.push(down);
        const left = getAt(board, rowIndex, colIndex - 1);
        if (left) adjacents.push(left);
        const right = getAt(board, rowIndex, colIndex + 1);
        if (right) adjacents.push(right);
      }
    });
  });
  return adjacents;
}

class CharacterBoard {
  licenses: Set<LicenseId>;
  constructor(
    job1: null | Job,
    job2: null | Job,
    quickenings: Array<LicenseId>,
    espers: Array<LicenseId>,
  ) {
    const licenses: Set<LicenseId> = new Set();
    const searchQueue: Set<LicenseId> = new Set(['o' as LicenseId]);
    const board1 = job1 == null ? null : getBoard(job1);
    const board2 = job2 == null ? null : getBoard(job2);
    let cnt = 0;
    while (searchQueue.size > 0) {
      if (cnt++ === 100) {
        break;
      }
      for (const id of searchQueue) {
        if (cnt++ === 100) {
          break;
        }
        const license = License.get(id);
        searchQueue.delete(id);
        if (license) {
          const isLock = ['summon', 'quickening'].includes(license.category);
          const shouldFind =
            !isLock || quickenings.includes(id) || espers.includes(id);
          if (shouldFind) {
            licenses.add(id);
            if (board1) {
              getAdjacents(board1, id).forEach(adj => {
                if (!licenses.has(adj)) searchQueue.add(adj);
              });
            }
            if (board2) {
              getAdjacents(board2, id).forEach(adj => {
                if (!licenses.has(adj)) searchQueue.add(adj);
              });
            }
          }
        }
      }
    }
    this.licenses = licenses;
  }

  getLicensesByCategory(category: string): License[] {
    const licenses: License[] = [];
    for (const id of this.licenses) {
      const license = License.get(id);
      if (license && license.category === category) {
        licenses.push(license);
      }
    }
    return licenses;
  }

  getHP(): number {
    let hp = 0;
    const licenses = this.getLicensesByCategory('hp');
    for (const license of licenses) {
      const num = Number(license.name.replace(/[^0-9]*/g, ''));
      hp += num;
    }
    return hp;
  }
}

interface CharacterProps {
  name: string;
}
export const Character: React.FC<CharacterProps> = ({name}) => {
  const [job1, setJob1] = useStoredState<Job>(name, 'job1');
  const [job2, setJob2] = useStoredState<Job>(name, 'job2');
  const [quickenings, setQuickenings] = useStoredState<Array<LicenseId>>(
    name,
    'quickenings',
  );
  const esperContext = useContext(EsperContext);
  const espers: LicenseId[] = useMemo(() => {
    const e: LicenseId[] = [];
    for (const [esperId, user] of esperContext.usedEspers) {
      if (user === name) {
        e.push(esperId);
      }
    }
    return e;
  }, [name, esperContext.usedEspers]);
  const board = useMemo(
    () => new CharacterBoard(job1, job2, quickenings || [], espers || []),
    [job1, job2, quickenings, espers],
  );
  const handleClick = (id: LicenseId) => {
    const license = License.get(id);
    if (!license) {
      return;
    }
    const alreadyHas = board.licenses.has(id);
    if (license.category === 'summon') {
      if (alreadyHas) {
        esperContext.removeEsper(id);
      } else {
        esperContext.addEsper(id, name);
      }
    } else if (license.category === 'quickening') {
      if (alreadyHas) {
        console.log('remove quickenings?');
        setQuickenings(removeQuickening(quickenings || [], id));
      } else {
        setQuickenings(addQuickening(quickenings || [], id));
      }
    }
  };
  return (
    <div style={styles.root}>
      <h2 style={styles.title}>{name}</h2>
      <div style={styles.row}>
        <div>
          <div>HP: {board.getHP()}</div>
          {[
            'swiftness',
            'battlelore',
            'magicklore',
            'phoenixlore',
            'potionlore',
          ].map(category => (
            <div key={category}>
              {category}: {board.getLicensesByCategory(category).length}
            </div>
          ))}
        </div>
        <div>
          <JobSelector value={job1} onChange={setJob1} />
          {job1 != null && (
            <div style={styles.board}>
              <Board
                job={job1}
                licenses={board.licenses}
                onClick={handleClick}
              />
            </div>
          )}
        </div>
        <div>
          <JobSelector value={job2} onChange={setJob2} />
          {job2 != null && (
            <div style={styles.board}>
              <Board
                job={job2}
                licenses={board.licenses}
                onClick={handleClick}
              />
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
