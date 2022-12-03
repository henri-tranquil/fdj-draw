import { Test, TestingModule } from '@nestjs/testing';
import { EuromillionsController } from './euromillions.controller';

describe('EuromillionsController', () => {
  let controller: EuromillionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EuromillionsController],
    }).compile();

    controller = module.get<EuromillionsController>(EuromillionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
