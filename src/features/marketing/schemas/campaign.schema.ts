import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Campaign extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  discountPercentage: number; // Ej: 20 para 20%

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);