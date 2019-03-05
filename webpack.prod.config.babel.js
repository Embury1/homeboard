import merge from 'webpack-merge';
import common from './webpack.common.config.babel';

export default merge.multiple(common, {
    client: {
        mode: 'production'
    },
    server: {
        mode: 'production'
    }
});