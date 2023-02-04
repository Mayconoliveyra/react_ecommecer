import Head from "next/head";
import { useContext } from "react";
import styled from "styled-components"

import { Content } from "../components/containe"
import { CardOne, CardTwo } from "../components/card/cards"

import StoreContext from "../context/store";

import { getAll } from "./api/products"

const CardsNavOneSC = styled.section`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    margin-top: 1.5rem;
    padding: 1rem;
    @media (max-width: 720px){
        padding: 0.5rem 0.5rem;
        margin-top: 0;
        margin-bottom: 3px;
    }
    [data-div="name-card"] {
        padding: 0.5rem;
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

export default function Home({ camas, brinquedos, cozinhas }) {
  const store = useContext(StoreContext)
  return (
    <>
      <Head>
        <title>{store.nome ? store.nome : 'Carregando...'}</title>
      </Head>
      <Content padding="0" noShadow>
        <CardsNavOneSC>
          <div data-div="name-card">
            <h2>Produtos que talvez possa lhe interessar</h2>
          </div>
          <div data-div="session-cards">
            {camas.map((item) => {
              return <CardOne key={item.id} product={item} />
            })}
          </div>
        </CardsNavOneSC>
        <CardsNavOneSC>
          <div data-div="name-card">
            <h2>Produtos para Casa</h2>
          </div>
          <div data-div="session-cards">
            {camas.map((item) => {
              return <CardTwo key={item.id} product={item} />
            })}
          </div>
        </CardsNavOneSC>
        <CardsNavOneSC>
          <div data-div="name-card">
            <h2>Produtos em ofertas</h2>
          </div>
          <div data-div="session-cards">
            {camas.map((item) => {
              return <CardOne key={item.id} product={item} />
            })}
          </div>
        </CardsNavOneSC>
      </Content>
    </>
  );
}

export async function getServerSideProps() {
  const data = await getAll()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { ...data },
  }
}