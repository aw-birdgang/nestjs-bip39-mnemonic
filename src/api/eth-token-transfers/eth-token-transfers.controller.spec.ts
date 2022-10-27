import { Test, TestingModule } from '@nestjs/testing';
import { EthTokenTransfersController } from './eth-token-transfers.controller';

describe('EthTokenTransfersController', () => {
  let controller: EthTokenTransfersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthTokenTransfersController],
    }).compile();

    controller = module.get<EthTokenTransfersController>(EthTokenTransfersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
