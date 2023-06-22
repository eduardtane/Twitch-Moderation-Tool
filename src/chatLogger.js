var fs = require('fs')

export function getDate()
{
    console.log("Today is " + new Date())
    // fs.open(chatLogDay, 'w+', function (err, file) {
    //     if (err) throw err;
    //     console.log('Saved!');
    //   });
}

export function addMessageToLog(username, message)
{
    // let chatLogger = fs.createWriteStream(chatLogDay)  
    // chatLogger.write(username + ": " + message)
    var chatLogDay = "chatLogs/Log_" + createTimeStamp() + '.txt'
    fs.appendFile(chatLogDay, createLogMessage(username, message, createMessageTimeStamp()), function (err) {
        if (err) throw err;
      });
}

function getUpdatedMonth(integer)
{
    return integer + 1
}

function createLogMessage(username, message, timestamp)
{
    return "[" + timestamp + "] " + username + ": " + message + "\n"
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
