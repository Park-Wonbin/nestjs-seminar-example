import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly walletService: WalletService,
  ) {}

  async create(dto: CreateUserDto) {
    const wallet = await this.walletService.create();
    const user = await this.userRepository.save({
      name: dto.name,
      email: dto.email,
      walletUuid: wallet.uuid,
    });
    return { ...user, wallet: wallet };
  }

  find() {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .leftJoinAndSelect('user.cats', 'cats')
      .leftJoinAndSelect('user.dogs', 'dogs')
      .select(['user.name', 'wallet.uuid', 'cats.name', 'dogs.name'])
      .getMany();

    return this.userRepository.find({
      select: ['name'],
      relations: ['wallet', 'dogs', 'cats'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  update(id: number, dto: UpdateUserDto) {
    return this.userRepository.update(
      {
        id: id,
      },
      { name: dto.name },
    );
  }
}
