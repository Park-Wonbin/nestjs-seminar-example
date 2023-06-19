import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDogDto } from './dto/create-dog.dto';
import { Dog } from './entities/dog.entity';

@Injectable()
export class DogService {
  constructor(
    @InjectRepository(Dog)
    private readonly dogRepository: Repository<Dog>,
  ) {}

  create(dto: CreateDogDto) {
    return this.dogRepository.save({
      name: dto.name,
      age: dto.age,
      userId: dto.userId,
    });
  }

  find() {
    return this.dogRepository.find({
      relations: ['user'],
    });
  }

  delete(id: number) {
    return this.dogRepository.delete({
      id: id,
    });
  }
}
