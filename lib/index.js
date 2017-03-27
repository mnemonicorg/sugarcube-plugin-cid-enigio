import Promise from 'bluebird';
import {get, getOr, curry} from 'lodash/fp';
import fetch from 'node-fetch';

const downloads = curry((a, u) => a.concat(getOr([], '_lf_downloads', u)));

const send = curry((dl, u, p, e) => {
  const size = 1777;
  const mime = 'text/plain';
  const fileName = `${get('videoId', dl)}.mp4`;
  const sha256 = get('_lf_id_hash', dl);
  const c = `${get('href', dl)}`;
  const path = 'demo';
  const userId = e;

  const url = `https://${u}:${p}@demo.enigio.com/s/timeStamp/reg?size=${size}&mime=${mime}&fileName=${fileName}&sha256=${sha256}&c=${c}&path=${path}&userId=${userId}`;

  return fetch(url).then(r => { console.log(r); return r.json(); });
});

const enigio = (envelope, {log, cfg}) => {
  const u = get('enigio.name', cfg);
  const p = get('enigio.password', cfg);
  const e = get('enigio.email', cfg);
  const d = get('data', envelope);

  log.debug('running enigio plugin');

  return Promise.reduce(d, downloads, [])
    .then(dls => Promise.map(dls, (dl) => send(dl, u, p, e)));
};

enigio.desc = 'Timestamp and store hash with enigio';

enigio.argv = {
  'enigio.name': {
    type: 'text',
    nargs: 1,
    desc: 'Enigio Username',
  },
  'enigio.password': {
    type: 'text',
    nargs: 1,
    desc: 'Enigio Password',
  },
  'enigio.email': {
    type: 'text',
    nargs: 1,
    desc: 'Enigio Email',
  },
};
const plugins = {
  enigio_timestamp: enigio,
};

export { plugins };
export default { plugins };
