import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('DENODE')
      .setDescription('public DENODE API')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', name: 'JWT', in: 'header' },
        'access-token',
      )
      .setBasePath('api')
      .build();
  }
}
