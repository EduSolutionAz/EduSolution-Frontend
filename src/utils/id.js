let counter = 0;

export function createId(prefix = 'id') {
  const ts = Date.now().toString(36);
  counter = (counter + 1) % 10000;
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${ts}_${rnd}${counter}`;
}
