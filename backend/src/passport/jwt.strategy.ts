// apps/auth-service/src/passport/jwt.strategy.ts
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { prisma } from "../prismaClient.js";
import { PassportStatic } from "passport";

// Use environment variable if defined, otherwise fallback
const SECRET_KEY = process.env.JWT_SECRET || "defaultSuperSecretKey";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

export const configurePassport = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
        });

        if (!user) {
          return done(null, false);
        }

        return done(null, user); // `req.user` will contain this
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
