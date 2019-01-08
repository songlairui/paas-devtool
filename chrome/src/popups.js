import { getTab } from 'src/utils';

async function detect() {
  const el = document.querySelector('#status');
  if (!el) {
    console.info('no element');
    return;
  }
  const { url } = await getTab();
  const status =
    url.indexOf('mypaas') > -1 ||
    url.indexOf('localhost') > -1 ||
    /^https?:\/\/[\d\.]{7,15}/.test(url);
  el.innerText = status ? 'on' : 'off';
}

detect();
