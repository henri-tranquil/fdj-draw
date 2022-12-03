import { Controller, Get, Param } from '@nestjs/common';
import { Euromillions } from './euromillions.dto';
import { EuromillionsService } from './euromillions.service';

@Controller('euromillions')
export class EuromillionsController {
  constructor(private euromillionsService: EuromillionsService) {}

  @Get('all')
  getAll(): { status: string; data: Euromillions[] } {
    return { status: 'OK', data: this.euromillionsService.getAll() };
  }

  @Get()
  getLatest(): { status: string; data: Euromillions } {
    return { status: 'OK', data: this.euromillionsService.getLatest() };
  }
}
