'use strict';
const fs = require('fs');
export var MODERATORS = require('../data/moderators.json')
   console.log(MODERATORS)
var myJSON

export function addModerator(channel) 
{
    if(channel.includes("@"))
    {
      channel = channel.substring(1)
    }
    console.log("Adding moderator " + channel)
    var newObj = {"modChannelName" : channel}
    MODERATORS.mods.push(newObj)
     myJSON = JSON.stringify(MODERATORS)
     fs.writeFile("./data/moderators.json", myJSON, 'utf8', function(err) {
        if (err) throw err;
        console.log('complete');
        })
    console.log(MODERATORS)
}

export function removeModerator(channel)
{ 
    if(channel.includes("@"))
    {
      channel = channel.substring(1)
    }
    console.log("Removing moderator " + channel)
    var index = MODERATORS.mods.map(function(e) { return e.modChannelName; }).indexOf(channel)
    MODERATORS.mods.splice(index, 1)
    myJSON = JSON.stringify(MODERATORS)
    fs.writeFile("./data/moderators.json", myJSON, 'utf8', function(err) {
        if (err) throw err;
        console.log('complete');
        })
    console.log(MODERATORS)
}