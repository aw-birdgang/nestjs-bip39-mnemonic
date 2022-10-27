import { Test, TestingModule } from '@nestjs/testing';
import { EthTransactionController } from './eth-transaction.controller';

describe('EthTransactionController', () => {
  let controller: EthTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthTransactionController],
    }).compile();

    controller = module.get<EthTransactionController>(EthTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
