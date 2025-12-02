import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estadísticas (Dashboard)')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  getDashboardData() {
    return this.statsService.getDashboardStats();
  }
}