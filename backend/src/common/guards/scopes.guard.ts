import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>("scopes", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user || {};

    // Auth0 may send "scope": "read:teams write:teams" OR "permissions": ["read:teams", "manage:teams"]
    const scopeStr = typeof user.scope === "string" ? user.scope : "";
    const scopes = scopeStr.split(" ").filter(Boolean);
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];

    const grants = new Set<string>([...scopes, ...permissions]);
    return required.every((need) => grants.has(need));
  }
}
