import {get, curry, merge} from 'lodash/fp';
import fetch from 'node-fetch';
import {envelope as env} from 'littlefork';

const send = curry((u, p, e, dl) => {
  const size = 1777;  // TODO: get the actual size of the video
  const mime = 'text/plain';
  const fileName = `${get('location', dl)}.mp4`;
  const sha256 = get('sha256', dl);
  const c = `${get('term', dl)}`;
  const path = 'demo'; // TODO: make demo a config option
  const userId = e;

  const url = `https://${u}:${p}@demo.enigio.com/s/timeStamp/reg?size=${size}&mime=${mime}&fileName=${fileName}&sha256=${sha256}&c=${c}&path=${path}&userId=${userId}`;

  return fetch(url)
  .then(r => {
    if (!r.ok) {
      throw new Error('Enigio Login Failed or resource wrong');
    }
    return r.json();
  })
  .then((t) => {
    const timestamp = get('v', t);
    return merge({timestamp}, dl);
  });
});

const enigio = (envelope, {log, cfg}) => {
  const u = get('enigio.name', cfg);
  const p = get('enigio.password', cfg);
  const e = get('enigio.email', cfg);

  const s = send(u, p, e);

  log.debug('running enigio plugin');

  return env.fmapDownloadsAsync(s, envelope);
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
