import axios, { AxiosResponse } from "axios";
import * as dotenv from "dotenv";
dotenv.config();

// Définition des variables
let clientId: string = process.env.JIRA_CLIENT_ID!;
let clientSecret: string = process.env.JIRA_CLIENT_SECRET!;

let accessToken: string = '';

// Définition de l'url pour obtenir le cloudid
const url = 'https://api.atlassian.com/oauth/token/accessible-resources';

// Création d'une interface pour spécifier les propriétés de l'objet
interface Authentication {
    clientId: string;
    clientSecret: string;
    cloudId: string;
    token: string;
}

interface Users {
    uid: string;
    name: string;
    accountType: string;
}

// Création de l'objet
const authObj: Authentication = {
    clientId: '',
    clientSecret: '',
    cloudId: '',
    token: ''
};


// Obtenir un nouveau token d'accès à partir des "Client Credentials"
(async (): Promise<void> => {
    const responseAccessToken: AxiosResponse = await axios.post('https://api.atlassian.com/oauth/token', null, {
        params: {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
        }
    });
    accessToken = responseAccessToken.data.access_token;
    const responseApiCloudID: AxiosResponse = await axios.get(url, {
        headers: {
        Authorization: `Bearer ${accessToken}`
        }
    });
    // Mise à jour de l'objet avec les valeurs obtenues par la requête API
    authObj.cloudId = responseApiCloudID.data[0].id;
    const responseUser: AxiosResponse = await axios.get(`https://api.atlassian.com/ex/jira/${authObj.cloudId}/rest/api/3/users/search?startAt=0&maxResults=50`, {
        headers: {
        Authorization: `Bearer ${accessToken}`
        }
    });
    console.log(responseUser.data[0].displayName);
})();

// Mise à jour de l'objet avec les valeurs obtenues par la requête API
// authObj.cloudId = response.data[0].id;
authObj.token = accessToken;
console.log(authObj.cloudId);
console.log(authObj.token);