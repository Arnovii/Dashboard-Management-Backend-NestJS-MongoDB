import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './features/products/products.service';
import { MarketingService } from './features/marketing/marketing.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const productsService = app.get(ProductsService);
  const marketingService = app.get(MarketingService);

  console.log('🌱 Iniciando proceso de sembrado (Seeding)...');

  // --- DATOS PARA SHARD 1 (Tecnologia, Electronica) ---
  const techProducts = [
    { name: 'Laptop Gamer Alienware', description: 'Potencia extrema para juegos', category: 'Tecnologia', price: 2500, quantity: 10, image: 'https://placehold.co/600x400/png' },
    { name: 'MacBook Pro M2', description: 'Para profesionales creativos', category: 'Computacion', price: 1800, quantity: 25, image: 'https://placehold.co/600x400/png' },
    { name: 'iPhone 15 Pro', description: 'Titanio y potencia', category: 'Electronica', price: 1200, quantity: 50, image: 'https://placehold.co/600x400/png' },
    { name: 'Monitor 4K Dell', description: 'Colores precisos', category: 'Computacion', price: 400, quantity: 3, image: 'https://placehold.co/600x400/png' }, // Stock Bajo (para probar alerta)
    { name: 'Mouse Logitech MX', description: 'Ergonomía avanzada', category: 'Tecnologia', price: 90, quantity: 100, image: 'https://placehold.co/600x400/png' },
  ];

  // --- DATOS PARA SHARD 2 (Ropa, Hogar, Otros) ---
  const otherProducts = [
    { name: 'Sofá 3 Cuerpos', description: 'Comodidad para tu sala', category: 'Hogar', price: 600, quantity: 5, image: 'https://placehold.co/600x400/png' },
    { name: 'Camiseta Básica', description: 'Algodón 100%', category: 'Ropa', price: 15, quantity: 200, image: 'https://placehold.co/600x400/png' },
    { name: 'Zapatillas Running', description: 'Para correr maratones', category: 'Deportes', price: 80, quantity: 40, image: 'https://placehold.co/600x400/png' },
    { name: 'Lámpara de Pie', description: 'Iluminación ambiental', category: 'Hogar', price: 45, quantity: 2, image: 'https://placehold.co/600x400/png' }, // Stock Bajo
    { name: 'Jeans Slim Fit', description: 'Estilo moderno', category: 'Ropa', price: 50, quantity: 60, image: 'https://placehold.co/600x400/png' },
  ];

  // --- DATOS MARKETING (Campaña) ---
  const campaigns = [
    { title: 'Black Friday Anticipado', discountPercentage: 30, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 7).toISOString(), isActive: true },
    { title: 'Liquidación Verano', discountPercentage: 50, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 30).toISOString(), isActive: false },
  ];

  // 1. Insertar Productos
  console.log('📦 Insertando Productos...');
  const allProducts = [...techProducts, ...otherProducts];
  
  for (const product of allProducts) {
    await productsService.create(product);
    console.log(`   > Creado: ${product.name} (${product.category})`);
  }

  // 2. Insertar Campañas
  console.log('📣 Insertando Campañas...');
  for (const campaign of campaigns) {
    await marketingService.create(campaign as any);
    console.log(`   > Campaña: ${campaign.title}`);
  }

  console.log('✅ ¡Sembrado completado exitosamente!');
  await app.close();
}

bootstrap();