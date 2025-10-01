export function formatDate(isoDate: string, locale: 'id' | 'en' = 'en'): string {
  const date = new Date(isoDate);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', options).format(date);
}

export function getRelativeTime(isoDate: string, locale: 'id' | 'en' = 'en'): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  type TimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

  const units: Record<TimeUnit, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  type TranslationKeys = TimeUnit | 'ago' | 'plural';

  const translations: Record<'en' | 'id', Record<TranslationKeys, string>> = {
    en: {
      year: 'year', month: 'month', week: 'week', day: 'day',
      hour: 'hour', minute: 'minute', second: 'second',
      ago: 'ago', plural: 's',
    },
    id: {
      year: 'tahun', month: 'bulan', week: 'minggu', day: 'hari',
      hour: 'jam', minute: 'menit', second: 'detik',
      ago: 'yang lalu', plural: '',
    },
  };

  const t = translations[locale];

  for (const [unit, secondsInUnit] of Object.entries(units)) {
    if (diffInSeconds >= secondsInUnit) {
      const value = Math.floor(diffInSeconds / secondsInUnit);
      const unitKey = unit as TimeUnit;
      const unitText = t[unitKey];
      const plural = value > 1 ? t.plural : '';
      return `${value} ${unitText}${plural} ${t.ago}`;
    }
  }

  return `0 ${t.second}${t.plural} ${t.ago}`;
}
