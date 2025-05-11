import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
