import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

// Définir les informations d'authentification OAuth2
let clientId: string = process.env.JIRA_CLIENT_ID!;
let clientSecret: string = process.env.JIRA_CLIENT_SECRET!;
let cloudId: string = ''!;

// Définir l'URL de l'API
const url = 'https://api.atlassian.com/oauth/token/accessible-resources';

// Obtenir un nouveau token d'accès à partir des "Client Credentials"
const getAccessToken = async (): Promise<string> => {
  const response: AxiosResponse = await axios.post('https://api.atlassian.com/oauth/token', null, {
    params: {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    }
  });
  return response.data.access_token;
};

// Effectuer la requête GET avec l'authentification OAuth2 pour obtenir le cloudid
const makeRequest = async (): Promise<void> => {
  const accessToken = await getAccessToken();
  const response: AxiosResponse = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  cloudId = response.data[0].id;
  console.log("Your cloud ID is: " + cloudId); // Afficher la réponse de l'API
};

// Appeler les fonctions pour effectuer les requêtes GET
makeRequest()
  .catch(error => console.error(error));