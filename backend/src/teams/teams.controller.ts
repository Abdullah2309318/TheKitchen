import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ScopesGuard } from "../common/guards/scopes.guard";
import { TeamsService } from "./teams.service";
import { AddPlayerDto } from "./dto/add-player.dto";
import { SetPlayersDto } from "./dto/set-players.dto";

class CreateTeamDto { name!: string }

@Controller("teams")
@UseGuards(AuthGuard("jwt"), ScopesGuard)
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}

  @Get()
  @SetMetadata("scopes", ["read:teams"])
  async list() {
    return this.teams.list();
  }

  @Post()
  @SetMetadata("scopes", ["manage:teams"])
  async create(@Body() dto: CreateTeamDto, @Req() req: any) {
    return this.teams.create(req.user, dto);
  }

  @Patch(":id/players")
  @SetMetadata("scopes", ["manage:teams"])
  async setPlayers(@Param("id") id: string, @Body() dto: SetPlayersDto) {
    return this.teams.setPlayers(id, dto.player_one ?? null, dto.player_two ?? null);
  }

  @Post(":id/players")
  @SetMetadata("scopes", ["manage:teams"])
  async addPlayer(@Param("id") id: string, @Body() dto: AddPlayerDto) {
    return this.teams.addPlayer(id, dto.name);
  }

  @Delete(":id/players/:slot")
  @SetMetadata("scopes", ["manage:teams"])
  async removePlayer(@Param("id") id: string, @Param("slot", ParseIntPipe) slot: number) {
    return this.teams.removePlayer(id, slot as 1 | 2);
  }
}
