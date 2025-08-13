import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
// import { RecipesModule } from "./recipes/recipes.module"; // REMOVE
import { TeamsModule } from "./teams/teams.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TeamsModule], // <-- only these
})
export class AppModule {}
