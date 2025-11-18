export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date
    .toLocaleDateString('es-ES', { month: 'short' })
    .replace('.', '');
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
};

