import React from 'react';
import {merge, StyleSheet} from './styles';
import {License, LicenseId} from './License';
import {HighlightContext} from './HighlightContext';

interface CellProps {
  id: null | string;
  active?: boolean;
}

export const Cell: React.FC<CellProps> = ({id, active = true}) => {
  const {highlighting, setHighlighting} = React.useContext(HighlightContext);
  const [isHovering, setHovering] = React.useState<boolean>(false);
  const license = License.get(id);
  return (
    <div
      style={merge(
        styles.cell,
        (isHovering || (highlighting != null && highlighting === id)) &&
          styles.cellHover,
        !active && styles.cellInactive,
      )}>
      {license && (
        <div
          onMouseEnter={() => {
            setHovering(true);
            setHighlighting(id as LicenseId);
          }}
          onMouseLeave={() => {
            setHovering(false);
            setHighlighting(null);
          }}>
          <img
            alt={license.name}
            style={styles.icon}
            src={`/assets/${license.category}.png`}
          />
          {/* {license.sequence != null && license.sequence !== '+' && (
            <div style={styles.number}>{license.sequence}</div>
          )} */}
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
  cellInactive: {
    opacity: 0.5,
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
    imageRendering: 'pixelated',
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
