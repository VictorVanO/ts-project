import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

// Définir les informations d'authentification OAuth2
let clientId: string = process.env.JIRA_CLIENT_ID!;
let clientSecret: string = process.env.JIRA_CLIENT_SECRET!;
let cloudId: string = ''!;

var timeExpire: number = 3600;
let accessToken: string = '';

// Définir l'URL de l'API
const url = 'https://api.atlassian.com/oauth/token/accessible-resources';

// Obtenir un nouveau token d'accès à partir des "Client Credentials"
(async (): Promise<void> => {
    const responseAccessToken: AxiosResponse = await axios.post('https://api.atlassian.com/oauth/token', null, {
        params: {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
        }
    });
    timeExpire = responseAccessToken.data.expires_in;
    accessToken = responseAccessToken.data.access_token;
    const responseApiCloudID: AxiosResponse = await axios.get(url, {
        headers: {
        Authorization: `Bearer ${accessToken}`
        }
    });
    cloudId = responseApiCloudID.data[0].id;
    const responseUser: AxiosResponse = await axios.get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/users/search?startAt=0&maxResults=50`, {
        headers: {
        Authorization: `Bearer ${accessToken}`
        }
    });
    console.log(responseUser.data[0].displayName);
})();