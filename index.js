const cosmic = require('cosmiconfig');
const loadToml = require('./utils/load-toml');

const fileNames = [
    'package.json',
    '.prettierrc',
    '.prettierrc.json',
    '.prettierrc.yaml',
    '.prettierrc.yml',
    '.prettierrc.js',
    'prettier.config.js',
    '.prettierrc.toml',
];

const cosmicOptions = {
    searchPlaces: fileNames,
    loaders: {
        '.toml': loadToml,
    },
};

const explorer = cosmic('prettier', cosmicOptions);

const merger = (acc, config) => {
    const configData = config.config;

    let overRides = [];
    Object.keys(configData)
        .filter(key => {
            if (key === 'overrides') {
                overRides = configData[key];
                return false;
            }
            return true;
        })
        .forEach(key => {
            acc[key] = configData[key];
        });

    console.log(overRides);
    console.log(acc);
    return acc;
};

module.exports = paths => {
    if (!paths) {
        throw new Error('You must pass in where to look for the config files');
    }
    const lookUps = Array.isArray(paths) ? paths : [paths];

    return lookUps
        .map(path => {
            if (!fileNames.includes(path)) {
                return explorer.searchSync(require.resolve(path));
            }
            return explorer.loadSync(path);
        })
        .filter(object => !!object)
        .reduce(merger, {});
};
