module.exports = {
    apps: [
        {
            name: 'node-generate',
            script: './index.js',
            cwd: './service/',
            // instances: 1,
            watch: false,
            ignore_watch: ['[/\\]./', 'node_modules', 'tmp', 'service/tmp'],
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
    ],
    deploy: {
        daily: {
            user: 'root',
            host: ['47.105.170.226'],
            ref: 'origin/node',
            repo: 'git@github.com:springHyc/bms-code-auto-generate.git',
            path: '/srv/hehe/bms-code-auto-generate3',
            'post-deploy': 'git pull && cd service && npm install && cd ../ && npm run node-daily',
            env: {
                NODE_ENV: 'daily'
            }
        }
    }
};
