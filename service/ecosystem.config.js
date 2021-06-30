module.exports = {
    apps: [
        {
            name: 'generate',
            script: './index.js',
            instances: 1,
            watch: true,
            ignore_watch: ['[/\\]./', 'node_modules', 'tmp']
        }
    ],
    deploy: {
        daily: {
            user: 'root',
            host: ['47.105.170.226'],
            ref: 'origin/node',
            repo: 'git@github.com:springHyc/bms-code-auto-generate.git',
            path: '/srv/bms-code-auto-generate',
            'post-deploy': 'git pull  && cd service && npm run daily',
            env: {
                NODE_ENV: 'daily'
            }
        }
    }
};
