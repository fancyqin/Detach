const log4js = require('log4js');

log4js.configure({
    appenders:{
        RENDER_LOG:{
            type:'stdout',
            filename:__dirname + '/log/render.log',
            encoding:'utf-8'
        }
    },
    categories: { 
        default: { 
            appenders: ['RENDER_LOG'],
            level: 'all' 
        }
    }
})

const logger = log4js.getLogger('RENDER_LOG');

module.exports = logger;