import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class MarketingService {
  constructor(@InjectModel(Campaign.name, 'SHARD_2') private campaignModel: Model<Campaign>) {}

  create(createDto: CreateCampaignDto) {
    const created = new this.campaignModel(createDto);
    return created.save();
  }

  findAll() {
    return this.campaignModel.find().sort({ createdAt: -1 }).exec();
  }

  async toggleActive(id: string) {
    const campaign = await this.campaignModel.findById(id);
    if(campaign) {
        campaign.isActive = !campaign.isActive;
        return campaign.save();
    }
    return null;
  }
  
  remove(id: string) {
      return this.campaignModel.findByIdAndDelete(id);
  }
}