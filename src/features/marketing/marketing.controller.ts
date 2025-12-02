import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Marketing (Campañas)')
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post()
  create(@Body() createDto: CreateCampaignDto) {
    return this.marketingService.create(createDto);
  }

  @Get()
  findAll() {
    return this.marketingService.findAll();
  }

  @Patch(':id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.marketingService.toggleActive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketingService.remove(id);
  }
}