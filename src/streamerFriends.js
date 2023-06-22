'use strict';
const fs = require('fs');
export var FRIEND_STREAMERS = require("../data/streamers.json")
console.log(FRIEND_STREAMERS)
var i
var myJSON
export function addStreamerFriend(channel)
{
    if(channel.includes("@"))
    {
      channel = channel.substring(1)
    }
    console.log("Adding " + channel + " to autoShoutOut")
    var newObj = {"channelName" : channel, "wasShoutedOut" : false}
    FRIEND_STREAMERS.streamers.push(newObj)
     myJSON = JSON.stringify(FRIEND_STREAMERS)
     fs.writeFile("./data/streamers.json", myJSON, 'utf8', function(err) {
        if (err) throw err;
        console.log('complete');
        })
    console.log(FRIEND_STREAMERS)
}
export function removeStreamerFriend(channel)
{
    if(channel.includes("@"))
    {
      channel = channel.substring(1)
    }
    console.log("Removing " + channel + " from autoShoutOut")
    var index = FRIEND_STREAMERS.streamers.map(function(e) { return e.channelName; }).indexOf(channel)
    FRIEND_STREAMERS.streamers.splice(index, 1)
    myJSON = JSON.stringify(FRIEND_STREAMERS)
    fs.writeFile("./data/streamers.json", myJSON, 'utf8', function(err) {
        if (err) throw err;
        console.log('complete');
        })
    console.log(FRIEND_STREAMERS)

}

export function resetAllShoutOutLevel()
{
    for (i = 0; i < FRIEND_STREAMERS.streamers.length; i++)
    {
        FRIEND_STREAMERS.streamers[i].wasShoutedOut = false;    
    }
    myJSON = JSON.stringify(FRIEND_STREAMERS)
        fs.writeFile("./data/streamers.json", myJSON, function(err) {
            if (err) throw err;
            console.log('complete');
            })
    console.log(FRIEND_STREAMERS)
}

export function resetShoutOutLevel(channel)
{
    if(channel.includes("@"))
    {
      channel = channel.substring(1)
    }
        var index = FRIEND_STREAMERS.streamers.map(function(e) { return e.channelName; }).indexOf(channel)
        FRIEND_STREAMERS.streamers[index].wasShoutedOut = false;
        myJSON = JSON.stringify(FRIEND_STREAMERS)
        fs.writeFile("./data/streamers.json", myJSON, function(err) {
            if (err) throw err;
            console.log('complete');
            })
    console.log(FRIEND_STREAMERS)
}
