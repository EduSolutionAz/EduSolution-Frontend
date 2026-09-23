let counter = 0;

export function createId(prefix = 'id') {
  const ts = Date.now().toString(36);
  counter = (counter + 1) % 10000;
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${ts}_${rnd}${counter}`;
}

export function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
