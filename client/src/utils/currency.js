export function formatRwf(amount) {
  return `RWF ${Number(amount).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;
}
