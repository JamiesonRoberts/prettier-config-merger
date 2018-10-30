const config = require('./index');

module.exports = config({ extends: ['eslint-config-arcane', '.prettierrc'] });
