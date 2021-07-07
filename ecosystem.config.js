module.exports = {
    apps: [
        {
            name: 'node-generate',
            script: './index.js',
            cwd: './service/',
            watch: false,
            log_date_format: 'YYYY-MM-DD HH:mm Z'
        }
    ],
    deploy: {
        production: {
            user: 'root',
            host: ['47.105.170.226'],
            ref: 'origin/master',
            repo: 'git@github.com:springHyc/bms-code-auto-generate.git',
            path: '/srv/bms-code-auto-generate2',
            'post-deploy': 'git pull && cd service && npm install && cd ../ && npm run deploy-node',
            env: {
                NODE_ENV: 'production'
            }
        }
    }
};
