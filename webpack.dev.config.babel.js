import merge from 'webpack-merge';
import common from './webpack.common.config.babel';

export default merge.multiple(common, {
    client: {
        mode: 'development',
        devServer: {
            proxy: {
                '/api': process.env.API_BASE_URL
            }
        }
    },
    server: {
        mode: 'development'
    }
});