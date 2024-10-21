import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {

    @Get()
    healthCheck(){
        return {
            ok: true, 
            message: 'Client Gateway is up and running'
        }
    }
}
