import Head from "next/head";
import { getSession } from "next-auth/react";

export default function Portal() {
    return (
        <>
            <Head>
                <title>Softconnect - Dashboard</title>
            </Head>
            <h1>Portal</h1>
        </>
    )
}

export async function getServerSideProps(context) {
    try {
        const { req } = context
        const session = await getSession({ req })
        if (session && session.id && session.email_auth && session.adm) {
            return {
                props: {},
            }

        }

        throw ""
    } catch (error) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
}