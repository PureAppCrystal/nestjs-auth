import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginRequestDto } from './dto/login.request';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: LoginRequestDto) {
    const { userId, password } = data;
    const user = await this.userVerify(userId, password);
    // TODO: login History
    const payload = {
      userId,
      sub: user.userId,
    };
    return await this.generateToken(payload);
  }

  async userVerify(userId: string, password: string): Promise<User> {
    const user = await this.userService.findOneForLogin(userId);
    if (!user) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    return user;
  }

  async generateToken(payload) {
    return {
      accessToken: await this.getAccessToken(payload),
      refreshToken: await this.getRefreshToken(payload),
    };
  }

  async getAccessToken(payload: object) {
    const options = {
      expiresIn: '5m', // TODO: env
    };
    return this.getToken(payload, options);
  }

  async getRefreshToken(payload: object) {
    const options = {
      expiresIn: '60m', // TODO: env
    };
    return this.getToken(payload, options);
  }

  async getToken(payload: object, options: object) {
    return this.jwtService.sign(payload, options);
  }
}
