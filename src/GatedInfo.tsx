import React from 'react';
import CharacterBoard from './CharacterBoard';
import {StyleSheet} from './styles';

interface GatedInfoProps {
  board: CharacterBoard;
}

export const GatedInfo: React.FC<GatedInfoProps> = ({board}) => {
  const quickenings = board
    .getLicensesByCategory('quickening')
    .map(license => 'Q' + license.sequence);
  const espers = board
    .getLicensesByCategory('summon')
    .map(license => license.getDescription());
  return (
    <span style={styles.root}>({[...quickenings, ...espers].join(', ')})</span>
  );
};

const styles: StyleSheet = {
  root: {
    marginLeft: 4,
    fontWeight: 300,
  },
};
