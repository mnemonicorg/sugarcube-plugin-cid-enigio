const enigio = (envelope, {log}) => {
  log.debug('running enigio plugin');

  return envelope;
};

enigio.desc = 'Print the envelope to the screen.';

enigio.argv = {
  'enigio.name': {
    type: 'text',
    nargs: 1,
    desc: 'Enigio Username',
  },
};
const plugins = {
  enigio_timestamp: enigio,
};

export { plugins };
export default { plugins };
