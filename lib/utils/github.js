const fetch = require('cross-fetch');

const getGithubData = async (token) => {
  const profileRes = await fetch('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${token}` 
    },
  });

  return profileRes.json();
};

const getToken = async (code) => {
  const tokenReq = await fetch ('https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GH_CLIENT_ID,
        client_secret: process.env.GH_CLIENT_SECRET,
        code
      })
    });
  const access_token = await tokenReq.json();
  console.log('<<<<<<<<<<<<<<<<<<<getToken access_token>>>>>>>>>>>>>>>>>>>>');
  console.log(access_token);
  return access_token;
};

module.exports = { getToken, getGithubData } ;

