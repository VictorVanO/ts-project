// Création d'une interface pour spécifier les propriétés de l'objet
export interface OAuth2 {
    clientId: string|undefined;
    clientSecret: string|undefined;
    cloudId?: string;
    accessToken?: string;
    expiresIn?: number;
}