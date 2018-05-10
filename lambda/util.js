const rp = require('request-promise')
const promise = require('bluebird')

const confluenceHost = 'https://minutes-poc.atlassian.net'
const createContent = '/wiki/rest/api/content/?os_authType=basic'

module.exports.generate_response = function (response) {
  response.speak("A wizard is never late");
}

module.exports.createContentPage = function (notes)
{
  promise.resolve()
    .then(function () {
      let options = {
        uri    : confluenceHost + createContent,
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': 'Basic ' + Buffer.from('alexa.minutes@gmail.com:xYAG5d0OL5bd9ta4PyTd0B71').toString('base64')
        }
      }
      let actionItem = '<ul><li>' + notes + '</li></ul>'
      let postData = {
        type : 'page',
        title: 'Minutes for YYYY-MM-DD Meeting',
        space: {
          key: 'MIN'
        },
        body : {
          storage: {
            value         : '<h1>Meeting Notes:</h1><h2>Action Items:</h2><ul><li>Add feature for creating Confluence page for notes.</li><li>Add feature to take input for additional commands, such as facilities problems.</li></ul>' + actionItem,
            representation: 'storage'
          }
        }
      }
      options.json = postData
      return rp(options)
    })
    .then(function (response) {
      console.log(1234)
      console.log(response)
    })

  return;
}

module.exports.isActionItem = function (notes)
{
  return notes.includes("action item");
}

module.exports.attendees = function (notes)
{
    var attendeesPhrase = "in the room we have";
    //var notes2 = "in the room we have Diego Dan Ryan Yakun Kerstin";
    let containsAttendees = notes.includes(attendeesPhrase);

if (containsAttendees) {
      var attendees = notes2.replace(attendeesPhrase,'');
      return attendees;
  } else {
      return null;
  }
}