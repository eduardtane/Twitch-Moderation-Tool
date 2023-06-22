import tmi from 'tmi.js'
import { BLOCKED_WORDS, BOT_USERNAME, CHANNEL_NAME, OAUTH_TOKEN, BOT_VERSION, TIMED_MESSAGES, HELLO_WORLD} from '../data/constants'
import { FRIEND_STREAMERS, addStreamerFriend, removeStreamerFriend, resetShoutOutLevel, resetAllShoutOutLevel} from './streamerFriends'
import {MODERATORS, addModerator, removeModerator} from './modList'
import {getDate, addMessageToLog} from './chatLogger'
import {addEventToLog} from './EventLogger'

var myBot vers [' + BOT_VERSION + '] has loaded')
const options = { 
    options: {debug: true, messagesLogLevel: "info" },
connection: {
    reconnect: true,
    secure: true
},
identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
},
channels: [ CHANNEL_NAME ]
}
const client = new tmi.Client(options);

resetAllShoutOutLevel() 
getDate()

client.connect().catch(console.error);
// events

client.on('disconnected', (reason) => 
{
    onDisconnectedHandler(reason)
})
  
function onDisconnectedHandler(reason) 
{
  console.log(`Disconnected: ${reason}`)
}

client.on('connected', (address, port) => 
{
  onConnectedHandler(address, port)
  client.say(CHANNEL_NAME.substring(1) , `[Bot V${BOT_VERSION}] Successfully joined channel`)
})
 
function onConnectedHandler(address, port) 
{
  console.log(`Connected: ${address}:${port}`)
}
client.on('hosted', (channel, username) => 
{
  addEventToLog(username + ' Hosted with ' + viewers + ' viewers')
  console.log('hosted by ' + username)
})
  
client.on('raided', (channel, username, viewers) => 
{
  addEventToLog(username + ' Raided with ' + viewers + ' viewers')
  setTimeout(function() { onRaidedHandler(channel, username, viewers) }, 45000)
})

client.on('subscription', (username, streakMonths) => 
{
  addEventToLog(username + ' Has subscribed, on a ' + streakMonths + ' streak!')
})

client.on('cheer', (userstate) => 
{
  addEventToLog(userstate.username + ' Has cheered ' + userstate.bits)
})

client.on('giftpaidupgrade', (username) => 
{
  addEventToLog(username + 'Has continued their gifted sub')
})

client.on('resub', (username,userstate) => 
{
  addEventToLog(username + ' Has resubbed for ' + userstate['msg-param-cumulative-months'] + ' months')
})

client.on('subgift', (username,recipient) => 
{
  addEventToLog(username + ' Has gifted a sub to ' + recipient)
})

client.on('reconnect', () => 
{
  reconnectHandler()
})

function reconnectHandler () 
{
  console.log('Reconnecting...')
}
  
  client.on('message', (channel, userstate, message, self) => 
  {
    doChatLogDump(userstate.username, message)
    if(self) {
      return
    }
    // if (message.toLowerCase().includes("discord"))
    // {
    //   client.say(channel,TIMED_MESSAGES[0])
    //   return
    // }
    let checkIfModerator = MODERATORS.mods.findIndex(j => j.modChannelName.toLowerCase() === userstate.username.toLowerCase());
    if (checkIfModerator != -1)
    {
      broadcasterCommand(channel, message)
    }
    if (userstate.username === BOT_USERNAME) {
      return
    }
    let index = FRIEND_STREAMERS.streamers.findIndex(i => i.channelName.toLowerCase() === userstate.username.toLowerCase());
    if (index != -1)
    {
      onFriendShoutOutHandler(channel,index)
      return
    }
    onMessageHandler(channel, userstate, message, self)
  })

  function timedMessages(aBool,channel)
  {
    if (aBool)
    {
      console.log('interval set')
       myInterval = setInterval(function() {
        getBotMessage(channel)
       }, 450000)
    }
    else
    {
      console.log('interval cleared')
      clearInterval(myInterval)
    }
  }

  function getBotMessage(channel)
  {
    var randomIndex = Math.floor(Math.random() * TIMED_MESSAGES.length)
    console.log("Message Number " + randomIndex)
    client.say(channel,TIMED_MESSAGES[randomIndex])
  }

  function doChatLogDump(username, message)
  {
   addMessageToLog(username, message)
  }

  function broadcasterCommand(channel, message)
  {
    var data = message.split(" ")
    data[0] = data[0].toLowerCase()
    switch(data[0])
    {
      case "!addmod":
        {
          addModerator(data[1])
          client.mod(channel, data[1])
          break
        }
      case "!removemod":
        {
          removeModerator(data[1])
          client.unmod(channel, data[1])
          break
        }
      case "!addfriend":
        {
          addStreamerFriend(data[1])
          break
        }
      case "!removefriend":
        {
          removeStreamerFriend(data[1])
          break
        }
      case "!disabletimedmessages":
        {
          client.say(channel,'[Bot V' + BOT_VERSION + '] Timed messages disabled')
          console.log('disabled')
          timedMessages(false,channel)
          break
        }
      case "!enabletimedmessages":
        {
          client.say(channel,'[Bot V' + BOT_VERSION + '] Timed messages enabled')
          console.log('enabled')
          timedMessages(true,channel)
          return
        }
      case "!givestatus":
        {
          client.say(channel,'[Bot V' + BOT_VERSION + '] Status == OK')
          return
        }
      case "!disconnect":
        {
          client.say(channel,'[Bot V' + BOT_VERSION + '] disconnecting...')
          client.disconnect()
          return
        }
      case "!spam":
        {
          spamMessage(channel,data[1])
          return
        }
      case "!resetso":
        {
          resetShoutOutLevel(data[1])
          return
        }
        case "!resetallso":
        {
          resetAllShoutOutLevel()
          return
        }
      // case "!so":
      //   {
      //     shoutoutHandler(channel,data[1])
      //     return
      //   }
      default:
        {
          break
        }

    }

  } 

  function spamMessage(channel,message)
  {
    var newMessage = message + " "
    var i
    for ( i = 0 ; i < 11 ; i++)
    {
      newMessage += message + " "
    }
    var SpamStart = setInterval(function() {
      spamMessageHandler(channel,newMessage)
    }, 10)
    var SpamStop = setTimeout(function() { clearTimeout(SpamStart)},160)


  }
  
  function spamMessageHandler(channel,message)
  {
    client.say(channel,message)
  }
  
  function onMessageHandler (channel, userstate, message, self) 
  {
    checkTwitchChat(userstate, message, channel)
  }
  
function checkTwitchChat(userstate, message, channel) 
{
  if (message.includes("!self"))
  {
    selfTimeout(channel, userstate.username)
  }
  if (BLOCKED_WORDS.some(blockedWord => message.toLowerCase().includes(blockedWord.toLowerCase()))) 
  {
    client.timeout(channel, userstate.username, 300, 'This is an automatic TimeOut due to usage of blocked terms, if you believe it to be unjust, whisper this user')
  }
}

function onFriendShoutOutHandler(channel,index)
{
  if (!FRIEND_STREAMERS.streamers[index].wasShoutedOut)
  {
    shoutoutHandler(channel,FRIEND_STREAMERS.streamers[index].channelName)
    FRIEND_STREAMERS.streamers[index].wasShoutedOut = true
  }
}
function hello (channel, userstate) {
  client.say(channel, `Well hello there @${userstate.username} !`)
}

function onRaidedHandler(channel, username, viewers) 
{
  client.say(channel,`Thank you @${username} for the ${viewers} viewers raid, here is a special ShoutOut`)
  client.say(channel, '!so @'+username)
}

function shoutoutHandler(channel,target)
{
  if(target.includes("@"))
   {
     target = target.substring(1)
   }
  client.say(channel, "!so @" + target)
}

function selfTimeout(channel, target)
{
    client.timeout(channel, target, 60, 'Self Timeout')
    client.say(channel, '@' + target + ' has decided to timeout themselves.')

}