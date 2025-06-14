import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CustomLogger } from './common/utils/logger/logger.service';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { TransactionModule } from './common/modules/transaction.module';
import { ETagModule } from './common/modules/etag.module';
import { databaseConfig } from './config/database.config';
import { GradingPeriodsModule } from './modules/grading-periods/grading-periods.module';
import { CourseOfferingsModule } from './modules/course-offerings/course-offerings.module';
import { CoursesModule } from './modules/courses/courses.module';
import { StaffModule } from './modules/staff/staff.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { StudentsModule } from './modules/students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
    }),
    TransactionModule,
    ETagModule,
    StudentsModule,
    GradingPeriodsModule,
    CourseOfferingsModule,
    CoursesModule,
    StaffModule,
    CredentialsModule,
    CalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLogger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
