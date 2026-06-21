import path from "node:path";
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Production',
        template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
        { // also handles CSS images in url()
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        { // for references stored in the HTML template
          test: /\.html$/i,
          use: ["html-loader"], 
        },
        { // for images used in the JavaScript; also need to default import the image in the JS
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: "asset/resource",
        },
        { // for fonts
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
    ],
  },
};
