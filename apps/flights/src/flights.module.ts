import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

@Module({
  imports: [],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}
