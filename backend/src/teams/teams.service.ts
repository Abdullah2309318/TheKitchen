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
      .from("profiles")
      .upsert({ id: sub, username }, { onConflict: "id" });
    if (error) throw new BadRequestException(error.message);
    return sub;
  }

  async list() {
    const { data, error } = await this.sb
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async create(user: any, dto: { name: string }) {
    const sub = await this.ensureProfile(user);
    const { data, error } = await this.sb
      .from("teams")
      .insert({ name: dto.name, created_by: sub })
      .select("*")
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  private async getTeamOrThrow(id: string): Promise<TeamRow> {
    const { data, error } = await this.sb.from("teams").select("*").eq("id", id).single();
    if (error) throw new NotFoundException("Team not found");
    return data as TeamRow;
  }

  async setPlayers(id: string, p1?: string | null, p2?: string | null) {
    const { data, error } = await this.sb
      .from("teams")
      .update({ player_one: p1 ?? null, player_two: p2 ?? null })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async addPlayer(id: string, name: string) {
    const team = await this.getTeamOrThrow(id);
    if (team.player_one && team.player_two) {
      throw new ConflictException("Team already has two players");
    }
    const update: Partial<TeamRow> = {};
    if (!team.player_one) update.player_one = name;
    else update.player_two = name;

    const { data, error } = await this.sb
      .from("teams")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async removePlayer(id: string, slot: 1 | 2) {
    if (slot !== 1 && slot !== 2) throw new BadRequestException("slot must be 1 or 2");

    const update = slot === 1 ? { player_one: null } : { player_two: null };
    const { data, error } = await this.sb
      .from("teams")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }
}
