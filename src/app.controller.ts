import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomApiVersions } from './common/constants/apiPathConstants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(`${CustomApiVersions.V1}/healthz`)
  healthCheck(): string {
    return 'Service up and running';
  }
}
