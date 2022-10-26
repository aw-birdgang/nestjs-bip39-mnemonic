import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../client.entity';

export class ClientResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _accessToken: string;
  @Exclude() private readonly _type: string;

  constructor(client: Client) {
    this._id = client.id;
    this._name = client.name;
    this._accessToken = client.accessToken;
    this._type = client.type;
  }

  @ApiProperty({ description: 'ID' })
  @Expose()
  get id(): number {
    return this._id;
  }
  @ApiProperty({ description: '이름' })
  @Expose()
  get name(): string {
    return this._name;
  }
  @ApiProperty({ description: '토큰' })
  @Expose()
  get accessToken(): string {
    return this._accessToken;
  }
  @ApiProperty({ description: '형태' })
  @Expose()
  get type(): string {
    return this._type;
  }
}
