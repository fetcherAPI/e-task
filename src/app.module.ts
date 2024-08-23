import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ResponsibleModule } from './responsible/responsible.module';
import { TaskModule } from './task/task.module';
import { TaskHistoryModule } from './task-history/task-history.module';
import { TaskNoteModule } from './task-note/task-note.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    ResponsibleModule,
    TaskModule,
    TaskHistoryModule,
    TaskNoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
