import { SwaggerTagNames } from "../constants/enums";


/**
 * Interface representing the structure of a Swagger tag
 */
export interface ISwaggerTag {
  name: SwaggerTagNames;
  description: string;
}
