import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateCampaignDto {
  @IsString() @IsNotEmpty()
  title: string;

  @IsNumber() @IsNotEmpty()
  discountPercentage: number;

  @IsDateString() @IsNotEmpty()
  startDate: string;

  @IsDateString() @IsNotEmpty()
  endDate: string;

  @IsBoolean() @IsOptional()
  isActive?: boolean;
}