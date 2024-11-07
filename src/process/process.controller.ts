import { Controller, Get } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('process')
export class ProcessController {
  constructor(private readonly event: EventEmitter2) {}
  @Get()
  async process() {
    this.event.emit('process:start');
  }

  @Get('reset')
  async reset() {
    this.event.emit('process:reset');
  }
}
