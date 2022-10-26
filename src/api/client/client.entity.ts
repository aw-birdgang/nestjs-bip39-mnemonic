import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({ length: 50 })
  @ApiProperty({ description: '이름' })
  name: string;

  @Column()
  @ApiProperty({ description: '토큰' })
  accessToken: string;

  @Column({ length: 50 })
  @ApiProperty({ description: '형태' })
  type: string;

  static of(params: Partial<Client>): Client {
    const client = new Client();
    Object.assign(client, params);
    return client;
  }

  update(name: string, type: string): void {
    this.name = name;
    this.type = type;
  }

  updateAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }
}
