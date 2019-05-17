/**
 * Class to abstract doing a BFS on a character's licenses, including their:
 *   1. Two jobs
 *   2. Esper selection
 *   3. Quickening selection
 * And provides shortcuts to get common stats on boards
 */
import {getBoard} from './Board';
import {Job} from './types';
import {LicenseId, License} from './License';

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

export function sortLicense(a: License, b: License): number {
  const numA = Number(a.sequence) || 0;
  const numB = Number(b.sequence) || 0;
  return numA - numB;
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

export default class CharacterBoard {
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
    return licenses.sort(sortLicense);
  }

  getNumberOfLicensesByCategory(category: string): number {
    return this.getLicensesByCategory(category).length;
  }

  getSequenceNumbersByCategory(category: string): string[] {
    return this.getLicensesByCategory(category).map(license => {
      return license.sequence;
    });
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

  hasLicense(id: LicenseId): boolean {
    return this.licenses.has(id);
  }
}
