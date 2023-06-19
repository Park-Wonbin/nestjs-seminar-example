import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DogService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';

@Controller('dog')
export class DogController {
  constructor(private readonly dogService: DogService) {}

  @Post()
  create(@Body() dto: CreateDogDto) {
    return this.dogService.create(dto);
  }

  @Get()
  find() {
    return this.dogService.find();
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.dogService.delete(id);
  }
}
