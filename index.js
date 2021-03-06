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

const arrayComparison = (array1, array2) =>
    array1.filter(value => array2.indexOf(value) < 0).length === 0;

const lookupMerge = (acc, config) => {
    const configData = config.config;

    let newOverRides = [];

    Object.keys(configData)
        .filter(key => {
            if (key === 'overrides') {
                newOverRides = configData[key];
                return false;
            }
            return true;
        })
        .forEach(key => {
            acc[key] = configData[key];
        });

    newOverRides.forEach(override => {
        if (!acc.overrides) acc.overrides = [];
        if (acc.overrides.length === 0) return acc.overrides.push(override);

        // handle merging objects here
    });

    console.log(newOverRides);
    console.log('---');

    return acc;
};

module.exports = ({ extends: paths, rules = {} }) => {
    if (!paths) {
        throw new Error('You must pass in where to look for the config files');
    }
    const lookUps = Array.isArray(paths) ? paths : [paths];

    return lookUps
        .map(path => {
            if (!fileNames.includes(path)) {
                return explorer.searchSync(require.resolve(path));
            }
            try {
                return explorer.loadSync(path);
            } catch (e) {
                return null;
            }
        })
        .filter(object => !!object)
        .reduce(lookupMerge, rules);
};
