var fs = require('fs')

function getDate()
{
    console.log("Today is " + new Date())
}

export function addEventToLog(message)
{
    var chatLogDay = "eventLogs/Event_Log_" + createTimeStamp() + '.txt'
    fs.appendFile(chatLogDay, createLogMessage(message, createMessageTimeStamp()), function (err) {
        if (err) throw err;
      });
}

function getUpdatedMonth(integer)
{
    return integer + 1
}

function createLogMessage(message, timestamp)
{
    return "[" + timestamp + "] " + message + "\n"
}

function createTimeStamp()
{
    var date = new Date()
    return date.getFullYear() + "_" + getUpdatedMonth(date.getMonth()) + "_" + date.getDate()
}

function createMessageTimeStamp()
{
    var date = new Date()
    return date.getFullYear() + "/" + getUpdatedMonth(date.getMonth()) + "/" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}
