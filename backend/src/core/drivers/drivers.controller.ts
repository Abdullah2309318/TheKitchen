import { Controller, Get, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ScopesGuard } from "../../common/guards/scopes.guard";
import { DriversService } from "./drivers.service";

@Controller("drivers")
@UseGuards(AuthGuard("jwt"), ScopesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  @SetMetadata("scopes", ["read:teams"]) // Reusing existing permission for now
  async findAll() {
    return this.driversService.findAll();
  }
}
