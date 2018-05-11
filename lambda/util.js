const rp = require('request-promise')
const promise = require('bluebird')

const confluenceHost = 'https://minutes-poc.atlassian.net'
const createContent = '/wiki/rest/api/content/?os_authType=basic'
const updateContent = '/wiki/rest/api/content/'
const os_type = '?os_authType=basic'
const getUrl = '&expand=space,body.view,version'

module.exports.generate_response = function (response) {
  response.speak("A wizard is never late");
}

module.exports.updatePage = function (notes) {
  promise.resolve(getContentPage())
    .then(function (response) {
        updateContentPage(response, notes)
    })
}

let formatDate = function () {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}


let getContentPage = function () {
  return promise.resolve()
    .then(function () {
      let options = {
        uri: confluenceHost + createContent + getUrl,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('alexa.minutes@gmail.com:xYAG5d0OL5bd9ta4PyTd0B71').toString('base64')
        }
      }
      return rp(options)
    })
    .then(function (response) {
      console.log(response)
      console.log(2345667)
      let resp = {}
      let responseJson = JSON.parse(response)
      for (let index in responseJson.results) {
        let article = responseJson.results[index]
        if (article.title.includes('Minutes for') || article.title.includes(formatDate())) {
          resp = {
            id: article.id,
            version: article.version.number,
            body: article.body.view.value
          }
        }
      }
      return resp
    })
}

let updateContentPage = function (info, notes) {
  promise.resolve()
    .then(function () {
      let options = {
        uri: confluenceHost + updateContent + info.id + os_type,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('alexa.minutes@gmail.com:xYAG5d0OL5bd9ta4PyTd0B71').toString('base64')
        }
      }
      let version = parseInt(info.version) + 1
      let postData = {
        type: 'page',
        version: {
          number: version.toString()
        },
        title: 'Minutes for 2018-05-10 Meeting',
        space: {
          key: 'MIN'
        },
        body: {
          storage: {
            value: info.body + '<li>' + notes + '</li>',
            representation: 'storage'
          }
        }
      }
      options.json = postData
      console.log(options)
      return rp(options)
    })
}

module.exports.createContentPage = function ()
{
  promise.resolve()
    .then(function ()
          {
            let options = {
              uri    : confluenceHost + createContent + getUrl,
              method : 'POST',
              headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Basic ' + Buffer.from('alexa.minutes@gmail.com:xYAG5d0OL5bd9ta4PyTd0B71').toString('base64')
              }
            }
            let postData = {
              type : 'page',
              title: 'Minutes for 2018-05-10 Meeting',
              space: {
                key: 'MIN'
              },
              body : {
                storage: {
                  value         : '<h1>Meeting Notes:</h1><h2>Action Items:</h2>',
                  representation: 'storage'
                }
              }
            }
            options.json = postData
            return rp(options)
          })
    .then(function (response)
    {
      console.log(response)
      return;
    })
}