import Head from "next/head";
import styled from "styled-components";
import { useContext } from "react";

import { CardThree } from "../../components/card/cards"
import { Content } from "../../components/containe"

import StoreContext from "../../context/store";

import { getSearch } from "../api/products";

const CardsNav = styled.section`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    [data-div="name-card"] {
        padding: 0.5rem;
        padding-bottom: 0.6rem;
        h2 {
            color: #0F1111;
            font-size: 1.4rem;
            font-family: ${({ theme }) => theme.font.family.bold};
        }
    }
    [data-div="session-cards"] {
        display: grid;
        justify-content: space-between;
        grid-template-columns: repeat(1,auto);
        margin-top: 5px;
        @media (min-width: 350px){
            grid-template-columns: repeat(2,auto);
        }
        @media (min-width: 525px){
            grid-template-columns: repeat(3,auto);
        }
        @media (min-width: 700px){
            grid-template-columns: repeat(4,auto);
        }
        @media (min-width: 900px){
            grid-template-columns: repeat(5,auto);
        }
    }
`

export default function Search({ data, search }) {
    const store = useContext(StoreContext)
    return (
        <>
            <Head>
                <title>{store.nome ? `${store.nome} : ${search}` : 'Carregando...'}</title>
            </Head>
            <Content bgWhite noShadow>
                {data.length > 0 ?
                    <>
                        <CardsNav>
                            <div data-div="name-card">
                                <h2>RESULTADOS</h2>
                            </div>
                            <div data-div="session-cards">
                                {data.map((product) => {
                                    return <CardThree key={product.id} product={product} />
                                })}
                            </div>
                        </CardsNav>
                    </>
                    :
                    <>
                        <div data-div='no-result'>
                            <h1>Nenhum resultado para {search}.</h1>
                            <p> Tente verificar a ortografia ou usar termos mais genéricos</p>
                        </div>
                    </>
                }
            </Content>
        </>
    );
}

export async function getServerSideProps(req) {
    const { search } = req.params

    const data = await getSearch(search)

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data, search },
    }
}