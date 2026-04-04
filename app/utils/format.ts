/**
 * Format as Nigerian Naira currency: "₦1,478.97"
 */
export function formatCurrency(val: number): string {
  return '₦' + val.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Format as trillions with Naira sign: "₦49.74T"
 */
export function formatTrillions(val: number): string {
  return '₦' + val.toFixed(2) + 'T'
}

/**
 * Format as billions with dollar sign: "$108.76B"
 */
export function formatBillions(val: number): string {
  return '$' + val.toFixed(2) + 'B'
}

/**
 * Format as percentage: "33.24%"
 */
export function formatPercent(val: number): string {
  return val.toFixed(2) + '%'
}

/**
 * Format number with human-readable scale.
 * >= 1_000_000 -> "133 million"
 * < 1_000_000 -> "3,841" (comma-separated)
 */
export function formatNumber(val: number): string {
  if (Math.abs(val) >= 1_000_000_000) {
    return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' billion'
  }
  if (Math.abs(val) >= 1_000_000) {
    return (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' million'
  }
  return val.toLocaleString('en-NG')
}

/**
 * Compact format for chart axis labels.
 * 1500 -> "1.5K", 1000000 -> "1M", 1000000000 -> "1B", 1000000000000 -> "1T"
 */
export function formatCompact(val: number): string {
  const abs = Math.abs(val)
  const sign = val < 0 ? '-' : ''

  if (abs >= 1_000_000_000_000) {
    return sign + (abs / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T'
  }
  if (abs >= 1_000_000_000) {
    return sign + (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
  }
  if (abs >= 1_000_000) {
    return sign + (abs / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (abs >= 1_000) {
    return sign + (abs / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return sign + abs.toString()
}
