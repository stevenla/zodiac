import React, {useMemo, useContext} from 'react';
import {Board} from './Board';
import {Job} from './types';
import {StyleSheet} from './styles';
import {LicenseId, License} from './License';
import {JobSelector} from './Job';
import {EsperContext} from './App';
import useStoredState from './useStoredState';
import CharacterBoard from './CharacterBoard';
import {Cell} from './Cell';
import {GatedInfo} from './GatedInfo';

function addQuickening(arr: LicenseId[], q: LicenseId): LicenseId[] {
  if (arr.length >= 3) {
    return arr;
  }
  return [...arr, q];
}

function removeQuickening(arr: LicenseId[], q: LicenseId): LicenseId[] {
  return arr.filter(v => v !== q);
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
      <h2 style={styles.title}>
        {name}
        <GatedInfo board={board} />
      </h2>
      <div>HP: {board.getHP()} / 2535</div>
      <div style={styles.row}>
        <div>
          {/* Display the portion of these */}
          {[
            'quickening',
            'summon',
            'hp',
            'battlelore',
            'magicklore',
            'swiftness',
            'channelling',
            'whitemagick',
            'blackmagick',
            'timemagick',
            'arcanemagick',
            'greenmagick',
            'technick',
            'passive',
            'genjiarmor',
          ].map(category => (
            <div key={category} style={styles.infoPanel}>
              {License.getAllByCategory(category).map(license => (
                <Cell
                  onClick={handleClick}
                  key={license.id}
                  id={license.id}
                  active={board.hasLicense(license.id)}
                />
              ))}
            </div>
          ))}
          <div style={styles.infoPanel}>
            {['potionlore', 'phoenixlore', 'remedylore', 'etherlore'].map(
              category =>
                License.getAllByCategory(category).map(license => (
                  <Cell
                    onClick={handleClick}
                    key={license.id}
                    id={license.id}
                    active={board.hasLicense(license.id)}
                  />
                )),
            )}
          </div>
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
  infoPanel: {
    width: 256,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
};
