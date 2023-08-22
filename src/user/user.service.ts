import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { bcryptContants } from 'src/constant/bcryptConstant';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const isExist = await this.userRepository.findOne({
      where: { userId: createUserDto.userId },
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이미 등록된 사용자입니다.`],
        error: 'Forbidden',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      bcryptContants.saltOrRounds,
    );
    const { password, ...result } =
      await this.userRepository.save(createUserDto);
    return result;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['seq', 'userId', 'userName', 'role'],
    });
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { userId: id },
      select: ['seq', 'userId', 'userName', 'role'],
    });
  }
}
