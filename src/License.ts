import keyData from './data/key.json';
import {sortLicense} from './CharacterBoard';
import memoize from 'lodash/memoize';

export type LicenseId = keyof typeof keyData;

export class License {
  id: LicenseId;
  name: string;
  cost: number;
  category: string;
  sequence: string;
  constructor(id: LicenseId) {
    const params = keyData[id];
    this.id = id;
    this.name = params.name;
    this.cost = Number(params.lp);
    this.category = params.category;
    this.sequence = id.replace(/[A-Za-z]+/, '');
  }
  static get = memoize(
    (id: null | string | LicenseId): null | License => {
      if (id == null || !keyData.hasOwnProperty(id)) {
        return null;
      }
      return new License(id as LicenseId);
    },
  );
  static getAllByCategory = memoize(
    (category: string): License[] => {
      const licenses = Object.keys(keyData).map(id => {
        const license = License.get(id);
        if (!license) {
          return null;
        }
        if (license.category === category) {
          return license;
        }
        return null;
      });
      const filtered = licenses.filter(x => x) as License[];
      return filtered.sort(sortLicense);
    },
  );
  getDisplayCategory(): string {
    switch (this.category) {
      case 'whitemagick':
        return 'White Magick';
      case 'blackmagick':
        return 'Black Magick';
      case 'timemagick':
        return 'Time Magick';
      case 'arcanemagick':
        return 'Arcane Magick';
      case 'greenmagick':
        return 'Green Magick';
      case 'quickening':
        return 'Quickening';
      case 'summon':
        return 'Esper';
      case 'hp':
        return 'HP';
      case 'gambit':
        return 'Gambit';
      case 'lightarmor':
        return 'Light Armor';
      case 'mysticarmor':
        return 'Mystic Armor';
      case 'heavyarmor':
        return 'Heavy Armor';
      case 'accessory':
        return 'Accessory';
      case 'channelling':
        return 'Channelling';
      case 'technick':
        return 'Technick';
      case 'sword':
        return 'Swords';
      case 'ninjasword':
        return 'Ninja Swords';
      case 'handbomb':
        return 'Handbombs';
      case 'bow':
        return 'Bows';
      case 'mace':
        return 'Maces';
      case 'shield':
        return 'Shields';
      case 'greatsword':
        return 'Greatswords';
      case 'pole':
        return 'Poles';
      case 'dagger':
        return 'Daggers';
      case 'katana':
        return 'Katanas';
      case 'genjiarmor':
        return 'Genji Armor';
      case 'axehammer':
        return 'Axes and Hammers';
      case 'gun':
        return 'Guns';
      case 'spear':
        return 'Spears';
      case 'staff':
        return 'Staves';
      case 'shieldblock':
        return 'Shield Block';
      case 'passive':
        return this.name;
      case 'battlelore':
      case 'magicklore':
      case 'potionlore':
      case 'phoenixlore':
      case 'remedylore':
      case 'etherlore':
      case 'swiftness':
        return this.name.replace(/\s*\d+/, '');
      default:
        return '';
    }
  }
  getDisplayName(): string {
    if (this.id === '+') {
      return 'Second Board';
    }
    if (this.id === 'o') {
      return this.name;
    }
    if (['summon'].includes(this.category)) {
      return this.getDisplayCategory();
    }
    return `${this.getDisplayCategory()} ${this.sequence}`;
  }
  getDescription(): Array<string> {
    if (['board', 'passive'].includes(this.category)) {
      return [];
    }
    return this.name
      .split('/')
      .map(name => name.trim())
      .filter(name => name !== this.getDisplayName());
  }
}
