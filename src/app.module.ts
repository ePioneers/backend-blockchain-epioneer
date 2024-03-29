import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainController } from './blockchain/blockchain.controller';
import { BlockchainService } from './blockchain/blockchain.service';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [
    BlockchainModule,
    ConfigModule.forRoot({
      envFilePath: '.devops.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController, BlockchainController],
  providers: [AppService, BlockchainService],
})
export class AppModule {}
