var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackRootPlugin = require("html-webpack-react-root-plugin");

module.exports = {
    devtool: "source-map",
    entry: {
        main: "./src/index.tsx"
    },
    output: {
        filename: "mdwiki.js",
        path: path.resolve("./dist/"),
        library: "[name]",
        libraryTarget: "window",
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackRootPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                    }
                ]
            },
        ]
    },
    devServer: {
        contentBase: './dist'
    }
};