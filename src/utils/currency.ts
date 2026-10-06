export type SupportedCurrency = 'PKR' | 'USD' | 'GBP' | 'AED' | 'EUR';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  PKR: 'PKR ',
  USD: '$',
  GBP: '£',
  AED: 'AED ',
  EUR: '€'
};

export const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  PKR: 1,
  USD: 0.0036,
  GBP: 0.0028,
  AED: 0.0132,
  EUR: 0.0033
};

export function formatCurrency(amountInPKR: number, currency: SupportedCurrency = 'PKR'): string {
  const rate = EXCHANGE_RATES[currency] || 1;
  const converted = amountInPKR * rate;

  if (currency === 'PKR') {
    return `PKR ${Math.round(converted).toLocaleString()}`;
  }

  const symbol = CURRENCY_SYMBOLS[currency] || '';
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
