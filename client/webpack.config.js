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
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: false,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            shuffleStringArray: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayEncoding: 'base64',
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        }, ['excluded_bundle_name.js']));
    }

    return config;
};