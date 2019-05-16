import keyData from './data/key.json';

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
  private static cache: Map<LicenseId, License> = new Map();
  static get(id: null | string | LicenseId): null | License {
    if (id == null || !keyData.hasOwnProperty(id)) {
      return null;
    }
    const licenseId = id as LicenseId;
    const cached = License.cache.get(licenseId);
    if (cached != null) {
      return cached;
    }
    const license = new License(licenseId);
    License.cache.set(licenseId, license);
    return license;
  }
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
      case 'passive':
        return this.name;
      case 'battlelore':
      case 'magicklore':
      case 'potionlore':
      case 'phoenixlore':
      case 'remedylore':
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
    if (
      [
        'board',
        'quickening',
        'gambit',
        'channelling',
        'swiftness',
        'passive',
      ].includes(this.category) ||
      this.category.includes('lore')
    ) {
      return [];
    }
    return this.name.split('/').map(name => name.trim());
  }
}
