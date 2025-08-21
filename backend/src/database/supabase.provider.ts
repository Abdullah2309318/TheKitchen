import { Provider } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const supabaseProvider: Provider<SupabaseClient> = {
  provide: SUPABASE_CLIENT,
  inject: [ConfigService], // Make sure ConfigService is injected here
  useFactory: (configService: ConfigService) => {
    
    // --- START DEBUGGING ---
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseKey = configService.get<string>('SUPABASE_SERVICE_ROLE');

    console.log('--- Supabase Provider ---');
    console.log('Attempting to create Supabase client...');
    console.log('Supabase URL from env:', supabaseUrl);
    console.log('Supabase Key from env is present:', !!supabaseKey); // Don't log the actual key for security
    console.log('-------------------------');
    // --- END DEBUGGING ---

    if (!supabaseUrl || !supabaseKey) {
      // This will give a clearer error if variables are missing
      throw new Error('Supabase URL or Service Role Key is missing from environment variables.');
    }

    return createClient(supabaseUrl, supabaseKey);
  },
};