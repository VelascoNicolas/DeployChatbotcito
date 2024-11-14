import { SwaggerOptions } from "swagger-ui-express";

export interface SwaggerUiOptions {
    customCss?: string | undefined;
    customCssUrl?: string | undefined;
    customfavIcon?: string | undefined;
    customJs?: string | undefined;
    customSiteTitle?: string | undefined;
    explorer?: boolean | undefined;
    isExplorer?: boolean | undefined;
    swaggerOptions?: SwaggerOptions | undefined;
    swaggerUrl?: string | undefined;
    swaggerUrls?: string[] | undefined;
}