import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './database/supabase.module';
import { UsersModule } from './users/users.module';
import { IngestModule } from './ingest/ingest.module';
import { TeamsModule } from './teams/teams.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.back',
    }),
    ScheduleModule.forRoot(),
    SupabaseModule,            
    AuthModule,
    UsersModule,
    IngestModule,
    TeamsModule, // Temporary module for frontend compatibility
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}