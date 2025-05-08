interface CleanDataOptions {
  removeDuplicates: boolean;
  missingThreshold: number;
  nullValues: string[];
}

function toCamelCase(str) {
  return str.replace(/[^a-zA-Z0-9 ]/g, '');
  // need to revisit the logic
  // .replace(/\s+(.)/g, (_, chr) => chr.toUpperCase())
  // .replace(/\s/g, '')
  // .replace(/^(.)/, (_, chr) => chr.toLowerCase());
}

function isValidDate(value) {
  return !isNaN(Date.parse(value));
}

function cleanData(data, options: Partial<CleanDataOptions> = {}) {
  try {
    const {
      removeDuplicates = true,
      missingThreshold = 0.5,
      nullValues = ['NA', 'N/A', 'null', '-', ''],
    } = options;

    const seen = new Set();

    return data
      .map((row) => {
        const cleanedRow = {};
        for (const [key, rawValue] of Object.entries(row)) {
          const column = toCamelCase(key.trim());
          let value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

          if (nullValues.includes(String(value).toUpperCase())) {
            value = null;
          }

          if (!isNaN(value as number) && value !== null && value !== '') {
            value = Number(value);
          }

          if (typeof value === 'string' && isValidDate(value)) {
            value = new Date(value).toISOString().split('T')[0];
          }

          cleanedRow[column] = value;
        }
        return cleanedRow;
      })
      .filter((row) => {
        const total = Object.keys(row).length;
        const nullCount = Object.values(row).filter(
          (v) => v === null || v === '',
        ).length;
        return nullCount / total <= missingThreshold;
      })
      .filter((row) => {
        const key = JSON.stringify(row);
        if (removeDuplicates && seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  } catch (e) {
    return data;
  }
}

export default cleanData;
