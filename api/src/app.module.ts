import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EuromillionsService } from './euromillions/euromillions.service';
import { EuromillionsController } from './euromillions/euromillions.controller';
import { MLModule } from './services/ml/ml.module';

@Module({
  imports: [MLModule],
  controllers: [AppController, EuromillionsController],
  providers: [EuromillionsService],
})
export class AppModule {}
