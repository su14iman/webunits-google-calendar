import { fetchOauthTokens } from 'tsdav';

fetchOauthTokens({
  authorizationCode: process.env.GOOGLE_AUTHORIZATION_CODE,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  tokenUrl: process.env.GOOGLE_TOKEN_URI,
  redirectUrl: process.env.GOOGLE_REDIRECT_URIS,
})
.then( res =>{
    console.log(res);
})
.catch( err =>{
    console.log(err);
});
// {
//   access_token: '',
//   expires_in: 0,
//   refresh_token: '',
//   scope: 'https://www.googleapis.com/auth/calendar',
//   token_type: 'Bearer'
// }