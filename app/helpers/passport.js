import passport from "passport";
import { Strategy as  BearerStrategy} from "passport-http-bearer";
import { validarToken } from "../middlewares/JWT.js";

passport.use(new BearerStrategy(
  async function(token, done) {
    const usuario =  await validarToken(token)
    if (!usuario) return done(null, false); 
    return done(null, usuario);
  }
));
export default passport;