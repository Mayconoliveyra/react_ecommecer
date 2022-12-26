import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { storeNextAut } from "../../../adapters/auth";

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
                console.log(usuario)
                return {
                    ...usuario
                }
            } catch {
                /* Se der erro retornar um objeto vazio */
                /* a tela de login vai ser atualizada pra tentar fazer login novamente */
                return {
                    error: "Desculpe-nos!. Não foi possível realizar o seu cadastro. Por favor, tente novamente utilizando outra opção de cadastro."
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
