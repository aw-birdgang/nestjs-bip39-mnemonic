import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { isEmpty } from '../../common/util/is-empty';
import Message from '../../common/common.message';
import { ClientResponseDto } from './dto/client-response.dto';
import { strEqual } from '../../common/util/utils';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  private readonly logger = new Logger(ClientService.name);

  async createClient(client: Client): Promise<Client> {
    const result = this.clientRepository.create(client);
    return this.clientRepository.save(result);
  }

  /**
   * 모든 클라이언트 정보를 조회 한다.
   *
   * @returns {Promise<Client[]>}
   */
  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  /**
   * 클라이언트 Id에 해당 하는 클라이언트 정보를 조회 한다.
   *
   * @param {number} id - 클라이언트 Id
   * @returns {Promise<ClientResponseDto>}
   */
  async findById(id: number): Promise<ClientResponseDto> {
    const client = await this.findClientById(id);
    return new ClientResponseDto(client);
  }

  async isExistClient(id: number): Promise<boolean> {
    const client = await this.clientRepository.findOne({
      where: { id: id },
    });
    return isEmpty(client) === false;
  }

  async checkExistClient(id: number, token: string): Promise<boolean> {
    const client = await this.clientRepository.findOne({
      where: { id: id },
    });
    return strEqual(token, client.accessToken);
  }

  /**
   * 클라이언트 Id에 해당 하는 클라이언트 정보를 반환 한다.
   *
   * @param {number} id - 클라이언트 Id
   * @returns {Promise<Client>}
   * @private
   */
  private async findClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id: id },
    });
    if (isEmpty(client) === true) {
      throw new NotFoundException(Message.NOT_FOUND_CLIENT);
    }
    return client;
  }

  async updateClient(id: number, accessToken: string): Promise<Client> {
    const client = await this.findClientById(id);
    client.updateAccessToken(accessToken);
    return this.clientRepository.save(client);
  }

  async deleteClientById(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
