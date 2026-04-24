import React, { createContext, useContext, useMemo, useState } from 'react';

export type Lang = 'en' | 'de' | 'ro' | 'ar' | 'zh';

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const translations: Record<Lang, Record<string, string>> = {
  en: {
    'tab.home': 'Home',
    'tab.wallet': 'Wallet',
    'tab.buy': 'Buy',
    'tab.launch': 'Launch',
    'tab.mining': 'Mining',
    'tab.settings': 'Settings',

    'home.subtitle': 'Native wallet · mining · launchpad · USDC onboarding',
    'home.banner.title': 'GOLDBRIX Announcement',
    'home.banner.text': 'Buy GBX with USDC is coming soon. Solana route first, then BNB and Ethereum.',
    'home.control': 'Mainnet Control Center',
    'home.ui': 'Product UI v2 active',
    'home.quick': 'Quick Actions',
    'home.wallet': 'Open Wallet',
    'home.wallet.sub': 'receive, send, history',
    'home.buy': 'Buy GBX',
    'home.buy.sub': 'USDC deposit flow',
    'home.launch': 'Create Coin',
    'home.launch.sub': 'launchpad builder',
    'home.mining': 'Mining',
    'home.mining.sub': 'pool + workers',

    'settings.title': 'Settings',
    'settings.subtitle': 'Security, language and app configuration',
    'settings.language': 'Language',
    'settings.security': 'Wallet Security',
    'settings.local': 'Local signing stays active',
    'settings.seed': 'Seed phrase remains on device',
    'settings.cloud': 'No cloud seed storage',
    'settings.status': 'App Status',

    'buy.title': 'Buy GBX',
    'buy.subtitle': 'USDC deposit watcher + GBX treasury payout',
    'buy.network': 'Select USDC Network',
    'buy.amount': 'USDC Amount',
    'buy.estimate': 'Estimated receive',
    'buy.order': 'Create Buy Order',

    'launch.title': 'Launchpad',
    'launch.subtitle': 'Create coins powered by GOLDBRIX',
    'launch.name': 'Coin Name',
    'launch.ticker': 'Ticker',
    'launch.supply': 'Supply',
    'launch.create': 'Create Coin Draft',
  },
  de: {
    'tab.home': 'Home',
    'tab.wallet': 'Wallet',
    'tab.buy': 'Kaufen',
    'tab.launch': 'Launch',
    'tab.mining': 'Mining',
    'tab.settings': 'Settings',

    'home.subtitle': 'Native Wallet · Mining · Launchpad · USDC Einstieg',
    'home.banner.title': 'GOLDBRIX Ankündigung',
    'home.banner.text': 'GBX Kauf mit USDC kommt bald. Zuerst Solana, danach BNB und Ethereum.',
    'home.control': 'Mainnet Kontrollzentrum',
    'home.ui': 'Product UI v2 aktiv',
    'home.quick': 'Schnellzugriff',
    'home.wallet': 'Wallet öffnen',
    'home.wallet.sub': 'empfangen, senden, Verlauf',
    'home.buy': 'GBX kaufen',
    'home.buy.sub': 'USDC Einzahlungsflow',
    'home.launch': 'Coin erstellen',
    'home.launch.sub': 'Launchpad Builder',
    'home.mining': 'Mining',
    'home.mining.sub': 'Pool + Worker',

    'settings.title': 'Einstellungen',
    'settings.subtitle': 'Sicherheit, Sprache und App-Konfiguration',
    'settings.language': 'Sprache',
    'settings.security': 'Wallet Sicherheit',
    'settings.local': 'Lokales Signieren bleibt aktiv',
    'settings.seed': 'Seed Phrase bleibt auf dem Gerät',
    'settings.cloud': 'Keine Cloud-Speicherung',
    'settings.status': 'App Status',

    'buy.title': 'GBX kaufen',
    'buy.subtitle': 'USDC Deposit Watcher + GBX Treasury Auszahlung',
    'buy.network': 'USDC Netzwerk wählen',
    'buy.amount': 'USDC Betrag',
    'buy.estimate': 'Geschätzter Empfang',
    'buy.order': 'Kaufauftrag erstellen',

    'launch.title': 'Launchpad',
    'launch.subtitle': 'Coins direkt mit GOLDBRIX erstellen',
    'launch.name': 'Coin Name',
    'launch.ticker': 'Ticker',
    'launch.supply': 'Supply',
    'launch.create': 'Coin Entwurf erstellen',
  },
  ro: {
    'tab.home': 'Home',
    'tab.wallet': 'Wallet',
    'tab.buy': 'Cumpără',
    'tab.launch': 'Launch',
    'tab.mining': 'Mining',
    'tab.settings': 'Setări',

    'home.subtitle': 'Wallet nativ · mining · launchpad · cumpărare cu USDC',
    'home.banner.title': 'Anunț GOLDBRIX',
    'home.banner.text': 'Cumpărarea GBX cu USDC vine curând. Prima rută: Solana, apoi BNB și Ethereum.',
    'home.control': 'Centru Control Mainnet',
    'home.ui': 'Product UI v2 activ',
    'home.quick': 'Acțiuni rapide',
    'home.wallet': 'Deschide Wallet',
    'home.wallet.sub': 'primește, trimite, istoric',
    'home.buy': 'Cumpără GBX',
    'home.buy.sub': 'flow depunere USDC',
    'home.launch': 'Creează Coin',
    'home.launch.sub': 'constructor launchpad',
    'home.mining': 'Mining',
    'home.mining.sub': 'pool + workeri',

    'settings.title': 'Setări',
    'settings.subtitle': 'Securitate, limbă și configurare aplicație',
    'settings.language': 'Limbă',
    'settings.security': 'Securitate Wallet',
    'settings.local': 'Semnarea locală rămâne activă',
    'settings.seed': 'Seed phrase rămâne pe telefon',
    'settings.cloud': 'Fără stocare în cloud',
    'settings.status': 'Status aplicație',

    'buy.title': 'Cumpără GBX',
    'buy.subtitle': 'USDC deposit watcher + payout GBX din treasury',
    'buy.network': 'Alege rețeaua USDC',
    'buy.amount': 'Sumă USDC',
    'buy.estimate': 'Primești estimat',
    'buy.order': 'Creează ordin de cumpărare',

    'launch.title': 'Launchpad',
    'launch.subtitle': 'Creează monede powered by GOLDBRIX',
    'launch.name': 'Nume coin',
    'launch.ticker': 'Ticker',
    'launch.supply': 'Supply',
    'launch.create': 'Creează draft coin',
  },
  ar: {
    'tab.home': 'الرئيسية',
    'tab.wallet': 'المحفظة',
    'tab.buy': 'شراء',
    'tab.launch': 'إطلاق',
    'tab.mining': 'تعدين',
    'tab.settings': 'الإعدادات',
    'settings.title': 'الإعدادات',
    'settings.subtitle': 'الأمان واللغة وإعدادات التطبيق',
    'settings.language': 'اللغة',
    'settings.security': 'أمان المحفظة',
    'settings.local': 'التوقيع المحلي يبقى فعالاً',
    'settings.seed': 'عبارة الاسترداد تبقى على الجهاز',
    'settings.cloud': 'لا يوجد تخزين سحابي',
    'settings.status': 'حالة التطبيق',
  },
  zh: {
    'tab.home': '首页',
    'tab.wallet': '钱包',
    'tab.buy': '购买',
    'tab.launch': '发行',
    'tab.mining': '挖矿',
    'tab.settings': '设置',
    'settings.title': '设置',
    'settings.subtitle': '安全、语言和应用配置',
    'settings.language': '语言',
    'settings.security': '钱包安全',
    'settings.local': '本地签名保持启用',
    'settings.seed': '助记词保留在设备上',
    'settings.cloud': '不使用云端存储',
    'settings.status': '应用状态',
  },
};

const fallback = translations.en;

const I18nContext = createContext<I18nValue>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => fallback[key] || key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const value = useMemo<I18nValue>(() => {
    const t = (key: string) => translations[lang]?.[key] || fallback[key] || key;
    return { lang, setLang, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
