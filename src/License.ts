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
}
