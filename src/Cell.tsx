import React, {useContext, useCallback, startTransition} from 'react';
import {css, StyleSheet} from 'aphrodite/no-important';
import {License, LicenseId} from './License';
import {EsperContext} from './App';
import {atom, useAtom, useAtomValue, useSetAtom} from 'jotai';
import memoize from 'lodash/memoize';

const highlightedAtom = atom<null | LicenseId>(null);
const getIsHighlighted = memoize((id: null | string) => {
  return atom((get) => {
    const highlighted = get(highlightedAtom);
    return highlighted != null && highlighted === id;
  });
});

interface CellProps {
  id: null | string;
  active?: boolean;
  onClick?: (id: LicenseId) => any;
  showSequence?: boolean;
}

export const Cell = React.memo<CellProps>(
  ({id, active = false, onClick = () => {}, showSequence = false}) => {
    const {usedEspers} = useContext(EsperContext);
    const isHighlighted = useAtomValue(getIsHighlighted(id));
    const setHighlighted = useSetAtom(highlightedAtom);
    const [isHovering, setHovering] = React.useState<boolean>(false);
    const license = License.get(id);
    return (
      <div
        className={css(
          styles.cell,
          (isHovering || isHighlighted) && styles.cellHover,
        )}>
        {license && (
          <div
            role="button"
            onClick={() => onClick(id as LicenseId)}
            className={css(
              !active && styles.cellInactive,
              ['summon', 'quickening'].includes(license.category) &&
                styles.cellLock,
            )}
            onMouseEnter={() => {
              setHovering(true);
              setHighlighted(id as LicenseId | null);
            }}
            onMouseLeave={() => {
              setHovering(false);
              setHighlighted(null);
            }}>
            <img
              alt={license.name}
              className={css(styles.icon)}
              src={`${process.env.PUBLIC_URL}/assets/${license.category}.png`}
            />
            {showSequence &&
              license.sequence != null &&
              license.sequence !== '+' && (
                <div className={css(styles.number)}>{license.sequence}</div>
              )}
          </div>
        )}
        {isHovering && license && (
          <div className={css(styles.tooltip)}>
            <div className={css(styles.tooltipTitle)}>
              {license.getDisplayName()}
            </div>
            {license.getDescription().map((line) => (
              <div key={line} className={css(styles.tooltipLine)}>
                {line}
              </div>
            ))}
            {usedEspers.get(license.id) && (
              <div style={styles.tooltipLine}>
                Used by {usedEspers.get(license.id)}
              </div>
            )}
            <div style={styles.tooltipCost}>{license.cost} LP</div>
          </div>
        )}
      </div>
    );
  },
);

const styles = StyleSheet.create({
  cell: {
    position: 'relative',
    display: 'flex',
    width: 16,
    height: 16,
  },
  cellLock: {
    cursor: 'pointer',
  },
  cellInactive: {
    opacity: 0.4,
    filter: 'grayscale(.75)',
  },
  cellHover: {
    backgroundColor: '#d3e7fa',
    borderRadius: 100,
    boxShadow: '0px 0px 0px 4px #d3e7fa, 0px 0px 0px 6px #6189EB',
    zIndex: 900,
  },
  icon: {
    width: 16,
    height: 16,
  },
  number: {
    fontSize: 10,
    fontWeight: 900,
    backgroundColor: 'rgba(255, 255, 255, .6)',
    padding: '0 2px',
    borderRadius: 100,
    position: 'absolute',
    top: 1,
    right: 1,
  },
  tooltip: {
    fontSize: 12,
    lineHeight: '14px',
    position: 'absolute',
    backgroundColor: '#eee',
    padding: '6px 12px 6px 8px',
    borderRadius: 8,
    left: 18,
    top: -4,
    zIndex: 999,
    border: '2px solid white',
    pointerEvents: 'none',
    opacity: 0.8,
  },
  tooltipTitle: {
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  tooltipLine: {
    whiteSpace: 'nowrap',
  },
  tooltipCost: {
    whiteSpace: 'nowrap',
    marginTop: 2,
    fontSize: 8,
  },
});
