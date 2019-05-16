import React from 'react';
import { StyleSheet } from './types';
import { License } from './License';

interface CellProps {
  id: null | string;
  active?: boolean;
}

export const Cell: React.FC<CellProps> = ({ id, active = false }) => {
  const [isHovering, setHovering] = React.useState<boolean>(false);
  const license = License.get(id);
  if (id == null) {
    return <div style={styles.cell} />;
  }
  return (
    <div style={styles.cell}>
      {license && (
        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
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
        <div style={styles.tooltip}>{license.name}</div>
      )}
    </div>
  );
};

const styles: StyleSheet = {
  cell: {
    position: 'relative',
    display: 'flex',
    width: 16,
    height: 16
  },
  icon: {
    width: 16,
    height: 16,
    imageRendering: 'pixelated'
  },
  number: {
    fontSize: 10,
    fontWeight: 900,
    backgroundColor: 'rgba(255, 255, 255, .6)',
    padding: '0 2px',
    borderRadius: 100,
    position: 'absolute',
    top: 1,
    right: 1
  },
  tooltip: {
    fontSize: 12,
    position: 'absolute',
    width: 120,
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 8,
    left: 16,
    top: 16,
    zIndex: 999
  }
};
