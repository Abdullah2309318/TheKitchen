import { Global, Module } from '@nestjs/common';
import { supabaseProvider } from './supabase.provider';

@Global() // Makes the Supabase client available everywhere
@Module({
  providers: [supabaseProvider],
  exports: [supabaseProvider],
})
export class SupabaseModule {}