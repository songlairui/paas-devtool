import isJSON from 'is-json';

function itor(mark, raw, from) {
  let value;
  let done = false;
  const idx = raw.indexOf(mark, from + 1);
  if (idx !== -1) {
    let str = raw.slice(0, idx - 1);
    if (raw[idx - 1] !== ',') {
      str += raw[idx - 1];
    }
    str += '}';
    if (isJSON(str)) {
      done = true;
      value = str;
    }
  } else {
    done = true;
  }
  return { value, idx, done };
}

export function trimRaw(raw) {
  if (!raw || raw[0] !== '{') {
    throw new Error('oriStr is not Object');
  }
  let from = 0;
  let value;
  let done;
  while (!done) {
    ({ done, value, idx: from } = itor('"debug"', raw, from));
  }
  return value;
}
