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
    const tokenScopes: string[] = (req.user?.scope || req.user?.scopes || "")
      .toString()
      .split(" ")
      .filter(Boolean);

    return required.every((s) => tokenScopes.includes(s));
  }
}
