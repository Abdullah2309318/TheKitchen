import { Injectable } from "@nestjs/common";

@Injectable()
export class RecipesService {
  list() {
    // demo data; replace with DB later
    return [
      { id: "1", title: "Tomato Pasta", created_at: new Date().toISOString() },
      { id: "2", title: "Mushroom Risotto", created_at: new Date().toISOString() },
    ];
  }
}
