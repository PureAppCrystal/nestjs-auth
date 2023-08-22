import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';

const envConfig = ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfig],
});

const typeOrm = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
});

@Module({
  imports: [envConfig, typeOrm, UserModule, AuthModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
