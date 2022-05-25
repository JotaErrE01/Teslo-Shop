
export const format = (value: number) => {

  // crear formateador
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return formatter.format(value); // retorna el valor formateado incluso con $ ej: $1,000.00
}

