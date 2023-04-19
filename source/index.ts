import axios, { AxiosResponse } from 'axios';

// Définir les informations d'authentification OAuth2
const clientId = '911FbCPRN8818PdoJRDpXsT6BQumvgUd';
const clientSecret = 'ATOA2sBqH-REwCQQqCAzmdoij9yXNeYEViAyWjRdAfnqglNmfkWpUimpqgJuBu5zEsKu0B6E0E76';
const cloudId = '8a5f5ebc-5cf2-46b1-bb77-f8f57ec5e7ad'

// Définir l'URL de l'API
const apiUrlCloudID = 'https://api.atlassian.com/oauth/token/accessible-resources';
const apiUrlUsers = 'https://api.atlassian.com/ex/jira/' + cloudId + '/rest/api/3/users/search?startAt=0&maxResults=50';

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
  const response: AxiosResponse = await axios.get(apiUrlCloudID, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  console.log(response.data); // Afficher la réponse de l'API
};

// Effectuer la requête GET avec le cloudid pour obtenir les users
const makeRequestUsers = async (): Promise<void> => {
  const accessToken = await getAccessToken();
  const response: AxiosResponse = await axios.get(apiUrlUsers, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  console.log(response.data); // Afficher la réponse de l'API
};

// Appeler les fonctions pour effectuer les requêtes GET
makeRequest()
  .catch(error => console.error(error));
makeRequestUsers()
  .catch(error => console.error(error));