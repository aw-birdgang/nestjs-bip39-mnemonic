import { EthTokenTransfersCreateRequestDto } from '../dto/eth-token-transfers-create-request.dto';

export class EthTokenTransferCommand {
  constructor(
    public readonly ethTokenTransfersCreateRequestDto: EthTokenTransfersCreateRequestDto,
  ) {}
}
