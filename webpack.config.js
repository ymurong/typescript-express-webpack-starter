'use strict';

const { resolve } = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin, NormalModuleReplacementPlugin } = require('webpack');
const packageJson = require('./package.json');

module.exports = (env = {}) => {
    const config = {
        context: resolve(__dirname),
        entry: ['./src/main.ts'], // Let's change our entry file's extension to '.ts'
        mode: env.development ? 'development' : 'production',
        target: 'node',
        devtool: env.development ? 'source-map' : false,
        output: {
            filename: `${packageJson.name}.js`,
            path: resolve(__dirname, 'dist'),
        },
        resolve: {
            extensions: ['.ts', '.js'], // We need to watch '.ts' files as well as '.js' files
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: "./tsconfig.json",
                    logLevel: "info",
                    extensions: [".ts", ".tsx"],
                    mainFields: ["browser", "main"],
                }),
            ],
            modules: ['node_modules', 'src', 'package.json']
        },
        stats: {
            modules: false, // We don't need to see this
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new DefinePlugin({
                VERSION: JSON.stringify(packageJson.version),
                DEVELOP: !!env.development,
            }),
            // Use module replacement to use different configs for dev and prod
            new NormalModuleReplacementPlugin(
                /[\\/]src[\\/]config[\\/]config.ts$/, // [\\/] works on all operating systems.
                env.development ? 'config.dev.ts' : 'config.ts'
            ),
        ],
    };

    if (env.nodemon) {
        config.watch = true;
        config.plugins.push(new NodemonPlugin());
    }

    if (env.analyse) {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static', // Generates file instead of starting a web server
            })
        );
    }

    return config;
};
