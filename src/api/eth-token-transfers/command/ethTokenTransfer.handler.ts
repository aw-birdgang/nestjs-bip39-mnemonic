// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { EthTokenTransferCommand } from './ethTokenTransfer.command';
// import { Logger } from '@nestjs/common';
// import { EthTokenTransfersService } from '../eth-token-transfers.service';
//
// @CommandHandler(EthTokenTransferCommand)
// export class EthTokenTransferHandler
//   implements ICommandHandler<EthTokenTransferCommand>
// {
//   constructor(private ethTokenTransfersService: EthTokenTransfersService) {}
//
//   private readonly logger = new Logger(EthTokenTransferHandler.name);
//
//   async execute(command: EthTokenTransferCommand) {
//     if (null == command) {
//       this.logger.error('null == command');
//     }
//     await this.ethTokenTransfersService.createEthTokenTransaction(
//       command.ethTokenTransfersCreateRequestDto,
//     );
//   }
// }
