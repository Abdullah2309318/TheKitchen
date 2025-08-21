import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type TeamRow = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  player_one: string | null;
  player_two: string | null;
};

@Injectable()
export class TeamsService {
  private sb: SupabaseClient;

  constructor() {
    this.sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
  }

  private async ensureProfile(user: any) {
    const sub = String(user?.sub);
    const username =
      (user?.nickname as string) ||
      (typeof user?.email === "string" ? user.email.split("@")[0] : sub);

    const { error } = await this.sb
      .from("users")
      .upsert({ auth0_sub: sub, username }, { onConflict: "auth0_sub" });
    if (error) throw new BadRequestException(error.message);
    return sub;
  }

  async list() {
    // Temporary: Return empty array since teams table was deleted
    return [];
  }

  async create(user: any, dto: { name: string }) {
    // Temporary: Return mock data since teams table was deleted
    const mockTeam = {
      id: Date.now().toString(),
      name: dto.name,
      created_by: user?.sub || 'unknown',
      created_at: new Date().toISOString(),
      player_one: null,
      player_two: null
    };
    return mockTeam;
  }

  private async getTeamOrThrow(id: string): Promise<TeamRow> {
    // Temporary: Return mock data
    return {
      id,
      name: "Mock Team",
      created_by: "unknown",
      created_at: new Date().toISOString(),
      player_one: null,
      player_two: null
    };
  }

  async setPlayers(id: string, p1?: string | null, p2?: string | null) {
    // Temporary: Return mock data
    return {
      id,
      name: "Mock Team",
      created_by: "unknown",
      created_at: new Date().toISOString(),
      player_one: p1,
      player_two: p2
    };
  }

  async addPlayer(id: string, name: string) {
    // Temporary: Return mock data
    return {
      id,
      name: "Mock Team",
      created_by: "unknown",
      created_at: new Date().toISOString(),
      player_one: name,
      player_two: null
    };
  }

  async removePlayer(id: string, slot: 1 | 2) {
    if (slot !== 1 && slot !== 2) throw new BadRequestException("slot must be 1 or 2");

    // Temporary: Return mock data
    return {
      id,
      name: "Mock Team",
      created_by: "unknown",
      created_at: new Date().toISOString(),
      player_one: slot === 1 ? null : "Player 2",
      player_two: slot === 2 ? null : "Player 1"
    };
  }
}
