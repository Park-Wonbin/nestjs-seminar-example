import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CatModule } from './cat/cat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogModule } from './dog/dog.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db-dev.sqlite',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    CatModule,
    DogModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
