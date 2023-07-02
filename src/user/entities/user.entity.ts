import { Cat } from 'src/cat/entities/cat.entity';
import { Dog } from 'src/dog/entities/dog.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  encryptedPassword: string;

  @Column()
  cryptoSalt: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  walletUuid: string;

  @OneToOne(() => Wallet)
  @JoinColumn({ name: 'walletUuid' })
  wallet: Wallet;

  @OneToMany(() => Dog, (dog) => dog.user)
  dogs: Dog[];

  @ManyToMany(() => Cat)
  @JoinTable({ name: 'cat_user_jt' })
  cats: Cat[];
}
