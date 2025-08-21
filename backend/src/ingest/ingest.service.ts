import { Injectable, Inject, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';
import axios from 'axios';

// This defines the shape of the data we expect back from OpenF1
interface OpenF1Driver {
  full_name: string;
  driver_number: number;
  country_code: string;
  name_acronym: string;
}

// This defines the shape of our database table
interface DriverV2Row {
  driver_number: number;
  first_name: string;
  last_name: string;
  name_acronym: string;
  country_code: string;
}

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name);

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  /**
   * Orchestrates the full process of fetching, transforming, and loading drivers.
   */
  async ingestLatestDrivers() {
    this.logger.log('Starting driver ingestion process...');

    // 1. FETCH
    const apiDrivers = await this.fetchLatestDriversFromAPI();
    if (!apiDrivers || apiDrivers.length === 0) {
      this.logger.warn('No drivers returned from API. Stopping process.');
      return;
    }

    // 2. TRANSFORM
    const dbRows = this.transformApiDataToDbSchema(apiDrivers);
    
    // 3. LOAD
    await this.loadDriversIntoDB(dbRows);
    
    this.logger.log('Driver ingestion process finished.');
  }
  
  /**
   * Step 1: Makes a request to the external API to get the raw data.
   */
  private async fetchLatestDriversFromAPI(): Promise<OpenF1Driver[]> {
    const baseUrl = 'https://api.openf1.org/v1';
    
    try {
      this.logger.log('Fetching drivers from OpenF1 API...');
      const response = await axios.get<OpenF1Driver[]>(`${baseUrl}/drivers`, {
        params: { meeting_key: 'latest' },
      });
      
      this.logger.log(`Successfully fetched ${response.data.length} driver entries.`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch data from API:', error.message);
      return []; // Return an empty array on failure
    }
  }

  /**
   * Step 2: Converts the raw data from the API's format into our database schema's format.
   */
  private transformApiDataToDbSchema(apiDrivers: OpenF1Driver[]): DriverV2Row[] {
    this.logger.log('Transforming API data...');
    
    return apiDrivers.map(apiDriver => {
      const nameParts = apiDriver.full_name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      return {
        driver_number: apiDriver.driver_number,
        first_name: firstName,
        last_name: lastName,
        name_acronym: apiDriver.name_acronym,
        country_code: apiDriver.country_code,
      };
    });
  }

  /**
   * Step 3: Saves the transformed data into your database.
   */
  private async loadDriversIntoDB(drivers: DriverV2Row[]) {
    if (drivers.length === 0) {
      this.logger.log('No drivers to load.');
      return;
    }

    this.logger.log(`Loading ${drivers.length} drivers into the database...`);
    
    const { error } = await this.supabase
      .from('drivers_v2')
      .upsert(drivers, { onConflict: 'driver_number' });

    if (error) {
      this.logger.error('Failed to load data into Supabase:', error.message);
    } else {
      this.logger.log('Successfully loaded data into the database!');
    }
  }
}