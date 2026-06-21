import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./src/index.html"],
    },
});