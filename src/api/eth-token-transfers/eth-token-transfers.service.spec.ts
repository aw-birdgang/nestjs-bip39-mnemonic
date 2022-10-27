import { Test, TestingModule } from '@nestjs/testing';
import { EthTokenTransfersService } from './eth-token-transfers.service';

describe('EthTokenTransfersService', () => {
  let service: EthTokenTransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EthTokenTransfersService],
    }).compile();

    service = module.get<EthTokenTransfersService>(EthTokenTransfersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
