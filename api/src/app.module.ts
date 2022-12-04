import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EuromillionsService } from './euromillions/euromillions.service';
import { EuromillionsController } from './euromillions/euromillions.controller';

@Module({
  imports: [],
  controllers: [AppController, EuromillionsController],
  providers: [EuromillionsService],
})
export class AppModule {}
