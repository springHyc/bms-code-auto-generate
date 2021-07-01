module.exports = {
    apps: [
        {
            name: 'node-generate',
            script: './index.js',
            cwd: './service/',
            // instances: 1,
            watch: true,
            ignore_watch: ['[/\\]./', 'node_modules', 'tmp'],
            log_date_format: 'YYYY-MM-DD HH:mm Z'
        },
        {
            name: 'front-generate',
            script: 'serve',
            env: {
                PM2_SERVE_PATH: './build',
                PM2_SERVE_PORT: 3000,
                PM2_SERVE_SPA: 'true',
                PM2_SERVE_HOMEPAGE: '/index.html'
            }
        }
    ]
};
