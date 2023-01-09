const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, SOFTCONNECT_ID, SOFTCONNECT_SECRET } = require("../../../../.env");
import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { storeNextAut } from "./index"

export const authOptions = {
    providers: [
        FacebookProvider({
            clientId: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({ session, token }) {
            try {
                /* secret é validado no backend. */
                const modelo = {
                    nome: session.user.name,
                    email: session.user.email,
                    secret: `${SOFTCONNECT_ID}${SOFTCONNECT_SECRET}`
                }
                const usuario = await storeNextAut(modelo)
                return {
                    ...usuario
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
