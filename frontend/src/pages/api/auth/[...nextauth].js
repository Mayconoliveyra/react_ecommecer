import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { storeNextAuth } from "./index"
const jwt = require("jwt-simple")

export const authOptions = {
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                if (credentials && credentials.session) {
                    try {
                        const userDecoded = jwt.decode(credentials.session, process.env.SECRET_KEY_AUTH);
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
                const modelo = {
                    nome: session.user.name,
                    email: session.user.email,
                }
                const user = await storeNextAuth(modelo)
                const userDecoded = jwt.decode(user, process.env.SECRET_KEY_AUTH);
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
    secret: process.env.NEXTAUTH_SECRET,
}
export default (req, res) => NextAuth(req, res, authOptions)
