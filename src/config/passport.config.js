import passport from "passport";
import GithubStrategy from "passport-github2";
import userModel from "../DAOs/models/Users.model.js";
import local from "passport-local";
import { createHash, validatePassword } from "../utils.js";

const LocalStrategy = local.Strategy;

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
                let user = await userModel.findOne({
                    email: profile._json.html_url,
                });

                if (!user) {
                    let newUser = {
                        first_name: profile.username,
                        last_name: "test lastname",
                        email: profile.profileUrl,
                        age: 25,
                        password: "1234",
                    };
                    const result = await userModel.create(newUser);
                    done(null, result);
                } else {
                    done(null, false);
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
                    const user = await userModel.findOne({ email: username });
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

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};
