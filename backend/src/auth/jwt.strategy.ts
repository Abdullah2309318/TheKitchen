import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as jwksRsa from "jwks-rsa";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const issuer = config.get<string>("AUTH0_DOMAIN"); // e.g. https://thekitchen-dev.eu.auth0.com/
    const audience = config.get<string>("AUTH0_AUDIENCE");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${issuer}.well-known/jwks.json`,
      }) as any,
      issuer,
      audience,
      algorithms: ["RS256"],
    });
  }

  // payload = decoded token
  validate(payload: any) {
    return payload; // available as req.user
  }
}
