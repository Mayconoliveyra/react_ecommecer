const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, TOKEN_KEY } = require("../../../../.env");
const { CLIENT_ID, CLIENT_SECRET } = require("../../../../client");
import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { storeNextAuth } from "./index"
const jwt = require('jsonwebtoken')

export const authOptions = {
    providers: [
        FacebookProvider({
            clientId: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                if (credentials && credentials.session) {
                    try {
                        const userDecoded = jwt.decode(credentials.session, TOKEN_KEY);
                        if (userDecoded) {
                            return userDecoded
                        }
                    } catch (error) {
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        async session({ session }) {
            try {
                /* secret é validado no backend. */
                const modelo = {
                    nome: session.user.name,
                    email: session.user.email,
                    secret: `${CLIENT_ID}${CLIENT_SECRET}`
                }
                const user = await storeNextAuth(modelo)
                const userDecoded = jwt.decode(user, TOKEN_KEY);
                if (userDecoded)
                    return {
                        ...userDecoded
                    }

                return {
                    400: "Não foi possível realizar a operação!. Por favor, atualize a página e tente novamente."
                }
            } catch (error) {
                if (error && error.response && error.response.data) {
                    return {
                        ...error.response.data
                    }
                }

                /* Se não vim nenhuma mensagem  de error, retornar mensagem padrão;*/
                return {
                    400: "Não foi possível realizar a operação!. Por favor, atualize a página e tente novamente."
                }
            }
        },
        async signIn(user, account, profile) {
            const { email } = user
            try {
                return true
            } catch (error) {
                console.log("DEU ERRO: " + error)
                return false
            }
        }
    },
    secret: NEXTAUTH_SECRET,
}
export default (req, res) => NextAuth(req, res, authOptions)
