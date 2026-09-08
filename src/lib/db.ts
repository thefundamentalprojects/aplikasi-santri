import { Santri, SuratIzin, AbsensiRecord, HafalanRecord, PelanggaranRecord, KeuanganRecord, PesantrenConfig } from './types';
import {
  INITIAL_PESANTREN_CONFIG,
  INITIAL_SANTRI,
  INITIAL_IZIN,
  INITIAL_ABSENSI,
  INITIAL_HAFALAN,
  INITIAL_PELANGGARAN,
  INITIAL_KEUANGAN
} from './dummyData';

const KEYS = {
  PESANTREN: 'santrihub_config',
  SANTRI: 'santrihub_santri',
  IZIN: 'santrihub_izin',
  ABSENSI: 'santrihub_absensi',
  HAFALAN: 'santrihub_hafalan',
  PELANGGARAN: 'santrihub_pelanggaran',
  KEUANGAN: 'santrihub_keuangan',
};

// Helper safe localStorage access
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

export const db = {
  // Config Pesantren
  getConfig: (): PesantrenConfig => getItem(KEYS.PESANTREN, INITIAL_PESANTREN_CONFIG),
  saveConfig: (config: PesantrenConfig): void => setItem(KEYS.PESANTREN, config),

  // Santri Management
  getSantriList: (): Santri[] => getItem(KEYS.SANTRI, INITIAL_SANTRI),
  saveSantriList: (list: Santri[]): void => setItem(KEYS.SANTRI, list),
  addSantri: (santri: Santri): Santri[] => {
    const list = db.getSantriList();
    const updated = [santri, ...list];
    db.saveSantriList(updated);
    return updated;
  },
  updateSantri: (santri: Santri): Santri[] => {
    const list = db.getSantriList();
    const updated = list.map(s => s.id === santri.id ? santri : s);
    db.saveSantriList(updated);
    return updated;
  },
  deleteSantri: (id: string): Santri[] => {
    const list = db.getSantriList();
    const updated = list.filter(s => s.id !== id);
    db.saveSantriList(updated);
    return updated;
  },

  // Surat Izin Management
  getIzinList: (): SuratIzin[] => getItem(KEYS.IZIN, INITIAL_IZIN),
  saveIzinList: (list: SuratIzin[]): void => setItem(KEYS.IZIN, list),
  addIzin: (izin: SuratIzin): SuratIzin[] => {
    const list = db.getIzinList();
    const updated = [izin, ...list];
    db.saveIzinList(updated);
    return updated;
  },
  updateIzin: (izin: SuratIzin): SuratIzin[] => {
    const list = db.getIzinList();
    const updated = list.map(i => i.id === izin.id ? izin : i);
    db.saveIzinList(updated);
    return updated;
  },

  // Absensi Management
  getAbsensiList: (): AbsensiRecord[] => getItem(KEYS.ABSENSI, INITIAL_ABSENSI),
  saveAbsensiList: (list: AbsensiRecord[]): void => setItem(KEYS.ABSENSI, list),
  addAbsensiBatch: (records: AbsensiRecord[]): AbsensiRecord[] => {
    const list = db.getAbsensiList();
    const updated = [...records, ...list];
    db.saveAbsensiList(updated);
    return updated;
  },

  // Hafalan Management
  getHafalanList: (): HafalanRecord[] => getItem(KEYS.HAFALAN, INITIAL_HAFALAN),
  addHafalan: (record: HafalanRecord): HafalanRecord[] => {
    const list = db.getHafalanList();
    const updated = [record, ...list];
    setItem(KEYS.HAFALAN, updated);
    return updated;
  },

  // Pelanggaran Management
  getPelanggaranList: (): PelanggaranRecord[] => getItem(KEYS.PELANGGARAN, INITIAL_PELANGGARAN),
  savePelanggaranList: (list: PelanggaranRecord[]): void => setItem(KEYS.PELANGGARAN, list),
  addPelanggaran: (record: PelanggaranRecord): PelanggaranRecord[] => {
    const list = db.getPelanggaranList();
    const updated = [record, ...list];
    setItem(KEYS.PELANGGARAN, updated);
    return updated;
  },

  // Keuangan Management
  getKeuanganList: (): KeuanganRecord[] => getItem(KEYS.KEUANGAN, INITIAL_KEUANGAN),
  saveKeuanganList: (list: KeuanganRecord[]): void => setItem(KEYS.KEUANGAN, list),
  toggleBayarKeuangan: (id: string): KeuanganRecord[] => {
    const list = db.getKeuanganList();
    const updated = list.map(item => {
      if (item.id === id) {
        const isLunas = item.status === 'Lunas';
        return {
          ...item,
          status: isLunas ? ('Belum Lunas' as const) : ('Lunas' as const),
          tanggalBayar: isLunas ? undefined : new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
    db.saveKeuanganList(updated);
    return updated;
  },

  // Reset & Export/Import Backup
  resetToDefault: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.PESANTREN);
    localStorage.removeItem(KEYS.SANTRI);
    localStorage.removeItem(KEYS.IZIN);
    localStorage.removeItem(KEYS.ABSENSI);
    localStorage.removeItem(KEYS.HAFALAN);
    localStorage.removeItem(KEYS.PELANGGARAN);
    localStorage.removeItem(KEYS.KEUANGAN);
  },

  exportDatabaseJSON: (): string => {
    const data = {
      config: db.getConfig(),
      santri: db.getSantriList(),
      izin: db.getIzinList(),
      absensi: db.getAbsensiList(),
      hafalan: db.getHafalanList(),
      pelanggaran: db.getPelanggaranList(),
      keuangan: db.getKeuanganList(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importDatabaseJSON: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.config) db.saveConfig(data.config);
      if (data.santri) db.saveSantriList(data.santri);
      if (data.izin) db.saveIzinList(data.izin);
      if (data.absensi) db.saveAbsensiList(data.absensi);
      if (data.hafalan) setItem(KEYS.HAFALAN, data.hafalan);
      if (data.pelanggaran) setItem(KEYS.PELANGGARAN, data.pelanggaran);
      if (data.keuangan) db.saveKeuanganList(data.keuangan);
      return true;
    } catch (error) {
      console.error("Gagal mengimpor database:", error);
      return false;
    }
  }
};
