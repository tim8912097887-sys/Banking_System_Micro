
export type ServiceConfig = {
    path: string
    url: string
    pathRewrite: Record<string,string>
    name: string
    timeout?: number
}