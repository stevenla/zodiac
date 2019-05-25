import React, {useContext, useCallback} from 'react';
import {merge, StyleSheet} from './styles';
import {License, LicenseId} from './License';
import {useHighlight} from './HighlightContext';
import {EsperContext} from './App';

interface CellProps {
  id: null | string;
  active?: boolean;
  onClick?: (id: LicenseId) => any;
  showSequence?: boolean;
}

export const Cell: React.FC<CellProps> = ({
  id,
  active = false,
  onClick = () => {},
  showSequence = false,
}) => {
  const {usedEspers} = useContext(EsperContext);
  const [isHighlighting, highlightStore] = useHighlight(
    useCallback(ids => ids.has(id as LicenseId), [id]),
  );
  const [isHovering, setHovering] = React.useState<boolean>(false);
  const license = License.get(id);
  return (
    <div
      style={merge(
        styles.cell,
        (isHovering || (isHighlighting != null && isHighlighting)) &&
          styles.cellHover,
      )}>
      {license && (
        <div
          role="button"
          onClick={() => onClick(id as LicenseId)}
          style={merge(
            !active && styles.cellInactive,

            ['summon', 'quickening'].includes(license.category) &&
              styles.cellLock,
          )}
          onMouseEnter={() => {
            setHovering(true);
            highlightStore.add(id as LicenseId);
          }}
          onMouseLeave={() => {
            setHovering(false);
            highlightStore.delete(id as LicenseId);
          }}>
          <img
            alt={license.name}
            style={styles.icon}
            src={`/assets/${license.category}.png`}
          />
          {showSequence &&
            license.sequence != null &&
            license.sequence !== '+' && (
              <div style={styles.number}>{license.sequence}</div>
            )}
        </div>
      )}
      {isHovering && license && (
        <div style={styles.tooltip}>
          <div style={styles.tooltipTitle}>{license.getDisplayName()}</div>
          {license.getDescription().map(line => (
            <div key={line} style={styles.tooltipLine}>
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
};

const styles: StyleSheet = {
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
};
