const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

const config = {
    entry: './ts/loader.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './static' }
        ]),
    ],
    resolve: {
        extensions: ['.ts'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "..", "web", 'public'),
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    if (argv.mode === 'production') {
        config.plugins.push(new JavaScriptObfuscator({
            compact: true,
            debugProtection: true,
            debugProtectionInterval: true,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            renameGlobals: true,
            rotateStringArray: false,
            selfDefending: true,
            shuffleStringArray: false,
            splitStrings: false,
            splitStringsChunkLength: 16,
            stringArray: false,
            stringArrayEncoding: 'base64',
            stringArrayThreshold: 0.5,
            transformObjectKeys: true
        }, ['excluded_bundle_name.js']));
    }

    return config;
};