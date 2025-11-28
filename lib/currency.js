// lib/currency.js
export const CURRENCY_CONFIG = {
  symbol: 'S/',
  code: 'PEN'
}

export function formatPrice(price) {
  const num = typeof price === 'number' ? price : parseFloat(price) || 0
  return `${CURRENCY_CONFIG.symbol} ${num.toFixed(2)}`
}
