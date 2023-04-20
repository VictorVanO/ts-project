import { organization } from "./organization";

export interface customer {
    accountId: string;
    name: string;
    organizationId: organization[];
}