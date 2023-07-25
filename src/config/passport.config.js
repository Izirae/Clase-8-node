import passport from "passport";
import GithubStrategy from "passport-github2";
import local from "passport-local";
import { createHash, validatePassword } from "../utils.js";
import UsersManager from "../DAOs/UsersManagerMongo.class.js";
import jwt from "passport-jwt";
import { cookieExtractor } from "../utils.js";

const UsersManagers = new UsersManager();
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtracJWT = jwt.ExtractJwt;

export const intializePassport = () => {
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: "Iv1.ca8023f46ff19bcf",
                clientSecret: "29e3e64c6595156cb4b1eb4de0c412c68b1295e1",
                callbackURL:
                    "http://localhost:8080/api/sessions/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log(profile);
                let user = await UsersManagers.getUser(profile._json.html_url);

                if (!user) {
                    let newUser = {
                        first_name: profile.username,
                        last_name: "test lastname",
                        email: profile.username,
                        age: 25,
                        password: "1234",
                    };
                    const newHashedPassword = createHash(newUser.password);
                    newUser.password = newHashedPassword;
                    const result = await UsersManagers.createUser(newUser);
                    done(null, result);
                } else {
                    console.log("usuario existente");
                    const result = await UsersManagers.getUser(
                        profile.profileUrl
                    );
                    done(null, result);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await UsersManagers.getUser(username);
                    if (!user) {
                        console.log("Usuario no encontrado");
                        return done(null, false);
                    }
                    if (!validatePassword(user, password)) {
                        console.log("Contraseña Incorrecta");
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done("Error al obtener el usuario: " + error);
                }
            }
        )
    );

    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtracJWT.fromExtractors([cookieExtractor]),
                secretOrKey: "EsteEsElSecreto",
            },
            async (jwtPayload, done) => {
                try {
                    return done(null, jwtPayload);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};
