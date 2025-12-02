export interface IOC {
    iocId: number,
    iocTypeId: number,
    iocTypeName: string,
    value: string
}

export interface ArticleForCreateReport {
    articleId: string,
    title: string,
    description: string,
    category: string,
    link: string,
    iocs: IOC[],
    publishDate: string,
    type:string
}

export enum ROLES {
    admin = "admin",
    analyst = "analyst",
    restricted_analyst = "restrictedAnalyst",
    user = "user"
}