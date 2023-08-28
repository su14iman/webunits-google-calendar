import 'dotenv/config'
import { google } from 'googleapis';
// ------------------------------
// oAuth2
// ------------------------------
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URIS,
);
const scopes = [
  'https://www.googleapis.com/auth/calendar'
];
const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true
});
console.log(authorizationUrl);

