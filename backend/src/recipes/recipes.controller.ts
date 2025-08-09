import { Controller, Get, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ScopesGuard } from "../common/guards/scopes.guard";
import { RecipesService } from "./recipes.service";

@Controller("recipes")
@UseGuards(AuthGuard("jwt"), ScopesGuard)
export class RecipesController {
  constructor(private readonly recipes: RecipesService) {}

  @Get()
  @SetMetadata("scopes", ["read:recipes"])
  list() {
    return this.recipes.list();
  }
}
