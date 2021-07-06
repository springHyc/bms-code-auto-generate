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
        daily: {
            user: 'root',
            host: ['47.105.170.226'],
            ref: 'origin/node',
            repo: 'git@github.com:springHyc/bms-code-auto-generate.git',
            path: '/srv/hehe/bms-code-auto-generate3',
            'post-deploy': 'git pull && cd service && npm install && cd ../ && npm run deploy-node',
            env: {
                NODE_ENV: 'daily'
            }
        }
    }
};
