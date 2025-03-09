export const getFormatedDate = (dateToFormat: string) => {
  const date = new Date(dateToFormat);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const getInputFormatedDate = (dateToFormat: string) => {
  const date = new Date(dateToFormat);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${year}-${month}-${day}`;
};

export function parseFormattedDate(dateString: string): string {
  dateString = dateString.trim();
  
  if (dateString.includes('T') && dateString.includes('Z')) {
    return dateString;
  }
  
  let date: Date;
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    return date.toISOString();
  }
  else if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(dateString)) {
    const parts = dateString.split(/[-/]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    date = new Date(year, month - 1, day);
  }
  else {
    date = new Date(dateString);
  }
  
  if (isNaN(date.getTime())) {
    console.error('Format de date invalide:', dateString);
    throw new Error(`Format de date invalide: ${dateString}`);
  }
  
  return date.toISOString();
}