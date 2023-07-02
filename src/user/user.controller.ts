import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Render,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserGuard } from './user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '유저 생성',
    description: '새로운 유저를 생성합니다.',
  })
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  find() {
    return this.userService.find();
  }

  @Render('index')
  @Get('profile')
  async profile() {
    return { user: await this.find() };
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '엑세스 토큰을 반환합니다.',
  })
  login(@Body() dto: LoginDto) {
    return this.userService.getToken(dto);
  }

  @UseGuards(UserGuard)
  @Get('auth/token-check')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '토큰 확인',
    description: '유효한 토큰인지 확인합니다.',
  })
  check(@Req() req) {
    return req.user;
  }
}
