const schedule = require('node-schedule')
module.exports = app => {
    schedule.scheduleJob('*/5 * * * * *', async function () {
        const data = new Date()
        console.log(`[pix] ${data}`)
    })
}