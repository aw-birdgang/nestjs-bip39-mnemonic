import { Test, TestingModule } from '@nestjs/testing';
import { EthTransactionService } from './eth-transaction.service';

describe('EthTransactionService', () => {
  let service: EthTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EthTransactionService],
    }).compile();

    service = module.get<EthTransactionService>(EthTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
