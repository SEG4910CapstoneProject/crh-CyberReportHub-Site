export interface IOC {
    iocId: Number,
    iocTypeId: Number,
    iocTypeName: String,
    value: String
}

export interface ArticleForCreateReport {
    articleId: String,
    title: String,
    description: String,
    category: String,
    link: String,
    iocs: IOC[],
    publishDate: String,
    type:string
}