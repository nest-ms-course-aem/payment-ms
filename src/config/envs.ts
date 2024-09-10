import 'dotenv/config'
import * as joi from 'joi'

//Defines the interface of the envs
interface IEnvVars { 
    PORT: number,
    SECRET_API_KEY: string,
    SUCCESS_URL: string,
    CANCEL_URL: string,
    ENDPOINT_SECRET: string,
}

// Schema validation
const envsSchema = joi.object({
    PORT: joi.number().required(),
    SECRET_API_KEY: joi.string().required(),
    SUCCESS_URL: joi.string().required(),
    CANCEL_URL: joi.string().required(),
    ENDPOINT_SECRET: joi.string().required(),
})
.unknown(true);

// Error and value
const {error, value} = envsSchema.validate(process.env);

if(error){
    throw new Error(`Env config validation error ${error?.message}`);
}

//Type value and return the env vars validated by Joi
const envVars: IEnvVars = value;

export const envs = {
    port: envVars?.PORT,
    secretApiKey: envVars?.SECRET_API_KEY,
    succesUrl: envVars?.SUCCESS_URL,
    cancelUrl: envVars?.CANCEL_URL,
    endpointSecet: envVars?.ENDPOINT_SECRET,
}
