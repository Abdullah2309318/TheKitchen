import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, RecipesModule],
})
export class AppModule {}
