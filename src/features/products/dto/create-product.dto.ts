import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateProductDto {
 @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto (OPCIONAL)',
    example: 'Laptop HP último modelo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Categoría del producto (usada para fragmentación/sharding)',
    example: 'Tecnologia',
  })
  @IsString()
  @IsNotEmpty()
  category: string;
  
  @ApiProperty({
    description: 'URL imagen del producto',
    example: 'https://res.cloudinary.com/dycqxw0aj/image/upload/v1764661928/Placeholder_view_fhh7gt.png',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 29.99,
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
  
  @ApiProperty({
    description: 'Cantidad del producto',
    example: 3,
    required: false,
  })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}