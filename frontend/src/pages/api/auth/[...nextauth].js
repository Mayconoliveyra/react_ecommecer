import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { storeNextAut } from "./index"

export const authOptions = {
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({ session, token }) {
            try {
                /* secret é validado no backend. */
                const modelo = {
                    nome: session.user.name,
                    email: session.user.email,
                    sub: token.sub,
                    secret: process.env.LOGIN_AUTH
                }
                const usuario = await storeNextAut(modelo)
                return {
                    ...usuario
                }
            } catch (error) {
                if (error && error.response && error.response.data) {
                    return {
                        error: error.response.data
                    }
                }

                /* Se não vim nenhuma mensagem  de error, retornar mensagem padrão;*/
                return {
                    error: "Não foi possível realizar a operação!. Por favor, atualize a página e tente novamente."
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
    }
}
export default (req, res) => NextAuth(req, res, authOptions)
