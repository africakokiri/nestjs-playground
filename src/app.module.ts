import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { UserModule } from './user/user.module';
import { UserModel } from 'src/user/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'kokiri',
      password: 'kokiri',
      database: 'kokiri',
      entities: [UserModel],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
