var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function(req, res) {

  var response;
  var term = req.query.text.trim();

  if (!term) {
    res.json([{
      title: '<i>(Search for Users)</i>',
      text: ''
    }]);
    return;
  }

  // Request Github API for user search
  try {
    response = sync.await(request({
      url: ' https://api.twitter.com/1.1/search/tweets.json',
      qs: {
        q: term,
        count: 15,
        result_type: mixed
      },
      gzip: true,
      json: true,
      timeout: 10 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Request Error');
    return;
  }

  // Check for error/empty responses
  if (response.statusCode !== 200 || !response.body) {
    res.status(500).send('Response Error');
    return;
  }

  var results = response.body.items.map(formatUserList);

  if (results.length === 0) {
    res.json([{
      title: '<i>(No users found)</i>',
      text: ''
    }]);
  } else {
    res.json(results);
  }
};

// generates HTML for a user search
function formatUserList(users) {

  // checks if listing has valid entries
  if(!users.login) {
    return null;
  }

  var html= 
  `<div style= 
  "display: flex; 
  flex-flow: row nowrap; 
  align-items: center;"
  >
    
    <img style="height:34px" src="${users.avatar_url}">
    
    <div style=
    " margin-left: 0.4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;">
      
      <span style="font-weight: 400; font-size: 1.2em;">
        ${users.login}
      </span>

    </div>
  </div>`;

  return {
    title: html,
    text: JSON.stringify(users),
  };
}
