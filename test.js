const merger = require('./index');

const data = merger({
    extends: ['eslint-config-arcane', '.prettierrc', '.prettierrc.json'],
});
console.log('-----');
console.log(data);
