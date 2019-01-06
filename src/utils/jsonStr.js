import isJSON from 'is-json';

function itor(marks, raw, from) {
  if (!Array.isArray(marks)) {
    marks = [marks];
  }
  let value;
  let done = false;
  const idx = Math.min(
    ...marks.map(mark => raw.indexOf(mark, from + 1)).filter(idx => idx > -1)
  );
  if (idx !== -1 && idx !== Infinity) {
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
    if (raw.length < 10000 && isJSON(raw)) {
      value = raw;
    }
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
  const marks = ['"debug"', '"_debugbar"'];
  while (!done) {
    ({ done, value, idx: from } = itor(marks, raw, from));
  }
  return value;
}
