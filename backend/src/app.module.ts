import { Module } from '@nestjs/common';
import { AppEntity } from './app.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { TaskEntity } from './tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'tbl_pretest',
      synchronize: true,
      entities: [AppEntity, TaskEntity],
      logging: true,
    }),
    TypeOrmModule.forFeature([AppEntity]),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
