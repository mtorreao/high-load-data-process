import { Controller, Get } from '@nestjs/common';
import { ProcessService } from './process.service';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}
  @Get()
  async process() {
    return this.processService.handler();
  }

  @Get('reset')
  async reset() {
    return this.processService.reset();
  }
}
