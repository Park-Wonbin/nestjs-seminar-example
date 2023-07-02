import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WalletService } from 'src/wallet/wallet.service';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly walletService: WalletService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto) {
    const wallet = await this.walletService.create();
    const salt = UserService.generateRandomString();
    const user = await this.userRepository.save({
      name: dto.name,
      email: dto.email,
      walletUuid: wallet.uuid,
      encryptedPassword: UserService.encryptPassword(dto.password, salt),
      cryptoSalt: salt,
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

  // 로그인
  async getToken(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    // 비밀번호 확인 후 JWT 토큰 발급
    if (
      user &&
      user.encryptedPassword ===
        UserService.encryptPassword(dto.password, user.cryptoSalt)
    ) {
      return this.issueToken(user);
    }
    throw new NotFoundException('잘못된 이메일 또는 패스워드');
  }

  // 토큰 발급
  private issueToken(user: User) {
    return this.jwtService.sign(
      {
        user: {
          uuid: user.id,
          name: user.name,
          email: user.email,
        },
        iat: new Date().getTime(),
      },
      {
        issuer: 'sample-api',
        expiresIn: 3600000 * 3, // 3 hours
      },
    );
  }

  // 토큰 인증
  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      // Check if the token has expired
      if (payload.exp < new Date().getTime()) return null;
      return payload.user;
    } catch (e) {
      return null;
    }
  }

  // --- 패드워드 암호화를 위한 함수들 ---
  private static generateRandomString(size = 64) {
    return crypto.randomBytes(size).toString('base64');
  }
  private static encryptPassword(password: string, cryptoSalt: string) {
    return crypto
      .pbkdf2Sync(password, cryptoSalt, 10000, 64, 'sha512')
      .toString('base64');
  }
  // ------------------------------
}
