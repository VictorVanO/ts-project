import axios, { AxiosResponse } from "axios";
import { OAuth2 } from "source/library/jira/dataModels/authentication";
import { user } from "source/library/jira/dataModels/user";
import { organization } from "source/library/jira/dataModels/organization";
import { customer } from "source/library/jira/dataModels/customer";
import { createLogger } from "../library/logger";
const logger = createLogger();
import * as dotenv from "dotenv";
dotenv.config();

// Création de l'objet 'auth' instancié de l'interface 'OAuth2'
const auth: OAuth2 = {
    clientId: process.env.JIRA_CLIENT_ID,
    clientSecret: process.env.JIRA_CLIENT_SECRET
};

const users: user[] = [];
const organizations: organization[] = [];
const customers: customer[] = [];

// Obtenir un nouveau token d'accès à partir des "Client Credentials"
(async (): Promise<void> => {
    const responseAccessToken: AxiosResponse = await axios.post("https://api.atlassian.com/oauth/token", null, {
        params: {
            grant_type: "client_credentials",
            client_id: auth.clientId,
            client_secret: auth.clientSecret,
        },
    });
    auth.expiresIn = responseAccessToken.data.expires_in;
    auth.accessToken = responseAccessToken.data.access_token;

    //! Request : Get cloudId
    const responseApiCloudID: AxiosResponse = await axios.get(
        "https://api.atlassian.com/oauth/token/accessible-resources",
        {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
            },
        }
    );
    auth.cloudId = responseApiCloudID.data[0].id;
    logger.info("OAuth2 object : " + auth);

    //! Request : Get users
    const responseUser: AxiosResponse = await axios.get(
        `https://api.atlassian.com/ex/jira/${auth.cloudId}/rest/api/3/users/search?startAt=0&maxResults=50`,
        {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
            },
        }
    );
    for (let i = 0; i < responseUser.data.length; i++) {
        let utilisateur: user = {
            uid: responseUser.data[i].accountId,
            displayName: responseUser.data[i].displayName,
            accountType: responseUser.data[i].accountType,
        };
        users.push(utilisateur);
    }
    console.log("users : ")
    console.log(users);

    //! Request : Get Organizations
    const responseOrganisation: AxiosResponse = await axios.get(
        `https://api.atlassian.com/ex/jira/${auth.cloudId}/rest/servicedeskapi/organization`,
        {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
            },
        }
    );
    // Boucle pour définir les propriétés de chaque organisation puis les envoyer dans mon array d'organisations
    for (let i = 0; i < responseOrganisation.data.values.length; i++) {
        let orga: organization = {
            id: responseOrganisation.data.values[i].id,
            name: responseOrganisation.data.values[i].name,
            link: responseOrganisation.data.values[i]._links.self
        };
        organizations.push(orga);
    }
    console.log("Organisations : ");
    console.log(organizations);

    // Boucle pour récupérer chaque user dans chaque organisation
    for (let i = 0; i < organizations.length; i++) {
        console.log("Customers in organisation id '" + organizations[i].id + "' : ");

        //! Request : Get users in organization
        const responseOrganisationUser: AxiosResponse = await axios.get(
            `https://api.atlassian.com/ex/jira/${auth.cloudId}/rest/servicedeskapi/organization/${organizations[i].id}/user`,
            {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            }
        );
        // Boucle pour définir les propriétés de chaque user de l'organisation
        for (let j = 0; j < responseOrganisationUser.data.values.length; j++) {
            // Si le customer existe déjà, ne va pas le réinstancier
            const found = customers.find((obj) => {
                return obj.name === responseOrganisationUser.data.values[j].displayName;
            });
            if (found) {
                found.organizationId.push(organizations[i]);
                console.log(found);
            } else {
                let cust: customer = {
                    accountId: responseOrganisationUser.data.values[j].accountId,
                    name: responseOrganisationUser.data.values[j].displayName,
                    organizationId: [],
                };
                cust.organizationId.push(organizations[i]);
                customers.push(cust);
                console.log(cust);
            }
        }
    }
    console.log("Customers : ");
    console.log(customers);
    logger.info(customers);
})();
