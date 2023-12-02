import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
    .setTitle('Course API')
    .setDescription('Course API description')
    .setVersion('0.0.1')
    .build();