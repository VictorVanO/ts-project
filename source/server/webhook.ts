import express from "express";
import bodyParser from "body-parser";
import { createLogger } from "../library/logger";
import { Worklog } from "source/library/jira/dataModels/worklog";

const logger = createLogger();
const app = express();
app.use(bodyParser.json());
// Définir l'URL pour le webhook
const webhookUrl = "/";

// Définir le gestionnaire de route pour le webhook
app.post(webhookUrl, (req, res) => {
    // console.log("Requête reçue depuis le webhook : ", req.body);
    switch (req.body.webhookEvent) {
        case "worklog_created": {
            logger.info("Worklog created : " + req.body.worklog.timeSpent);
            break;
        }
        case "worklog_updated": {
            logger.info("Worklog updated : " + req.body.worklog.timeSpent);
            break;
        }
        case "worklog_deleted": {
            logger.info("Worklog deleted : " + req.body.worklog.timeSpent);
            break;
        }
        case "jira:issue_created": {
            logger.info("Issue created : " + req.body.issue.id);
            break;
        }
        case "jira:issue_updated": {
            logger.info("Issue updated : " + req.body.issue.id);
            break;
        }
        case "jira:issue_deleted": {
            logger.info("Issue deleted : " + req.body.issue.id);
            break;
        }
        case "comment_created": {
            logger.info("Commented created : " + req.body.comment.body);
            break;
        }
        case "comment_updated": {
            logger.info("Commented updated : " + req.body.comment.body);
            break;
        }
        case "comment_deleted": {
            logger.info("Commented deleted : " + req.body.comment.body);
            break;
        }
        default: {
            console.log(req.body);
        }
    }
    res.status(200).send("Webhook reçu avec succès !");
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log("Serveur démarré sur le port 3000");
});

// Rajouter l'asynchrone async/await, route et logger
