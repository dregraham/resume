export const asList = v => Array.isArray(v) ? v : [];
export const asStr  = v => (typeof v === 'string' ? v : '');
export const lower  = v => asStr(v).toLowerCase();