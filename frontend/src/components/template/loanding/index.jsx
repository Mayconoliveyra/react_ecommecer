import Head from 'next/head';
import styled from "styled-components"
const Load = styled.main`
    display: flex;
    justify-content: center;
    align-items:center;
    height: 100vh;
    div{
        background-image: url('/assets/images/loading_gif.gif');
        background-size: cover;
        background-repeat: no-repeat;
        padding:0;
        margin:0;
        height: 110px;
        width: 110px;
    }
`
export default function Loanding() {
    return (
        <>
            <Head>
                <title>Carregando...</title>
            </Head>
            <Load>
                <div></div>
            </Load>
        </>
    )
}