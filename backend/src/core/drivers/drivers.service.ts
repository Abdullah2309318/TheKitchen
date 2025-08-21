import { Injectable, BadRequestException } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type Driver = {
  driver_id: string;
  driver_number: number;
  first_name: string;
  last_name: string;
  name_acronym: string;
  country_code: string;
};

@Injectable()
export class DriversService {
  private sb: SupabaseClient;

  constructor() {
    this.sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
  }

  async findAll(): Promise<Driver[]> {
    const { data, error } = await this.sb
      .from("drivers_v2")
      .select("*")
      .order("last_name");
    
    if (error) throw new BadRequestException(error.message);
    
    // Debug: Log the raw data from database
    console.log('Raw drivers data from DB:', data?.slice(0, 3)); // Log first 3 drivers
    
    // Transform the data to match the expected frontend format
    const transformedData = data?.map(driver => ({
      driver_id: driver.id.toString(),
      driver_number: driver.driver_number,
      first_name: driver.first_name,
      last_name: driver.last_name,
      name_acronym: driver.name_acronym,
      country_code: driver.country_code
    })) || [];
    
    // Debug: Log the transformed data
    console.log('Transformed drivers data:', transformedData?.slice(0, 3)); // Log first 3 drivers
    
    return transformedData;
  }
}
