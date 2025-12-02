import { Module } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';

@Module({
  imports: [
    // Guardamos Marketing SOLO en Shard 2 (Hogar/General) para balancear
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }], 'SHARD_2'),
  ],
  controllers: [MarketingController],
  providers: [MarketingService],
})
export class MarketingModule {}