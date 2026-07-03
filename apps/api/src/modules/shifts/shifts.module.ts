import { Module } from '@nestjs/common';
import { ShiftsController } from './shifts.controller';
import { ShiftsScheduler } from './shifts.scheduler';
import { ShiftsService } from './shifts.service';

@Module({
  controllers: [ShiftsController],
  providers: [ShiftsService, ShiftsScheduler],
  exports: [ShiftsService],
})
export class ShiftsModule {}
