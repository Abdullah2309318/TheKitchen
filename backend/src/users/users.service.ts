import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class UsersService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  // Example function to find or create a user profile after they log in
  async findOrCreateFromAuth0(auth0Sub: string, username: string) {
    const { data, error } = await this.supabase
      .from('users')
      .upsert({ auth0_sub: auth0Sub, username: username })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}