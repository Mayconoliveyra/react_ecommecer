import Head from "next/head";
import { useContext } from "react";

import CategoriesNav from "../components/categoriesNav";

import { Content } from "../components/containe"
import { CardsNav } from "../components/home/components"
/* import CardsNav from "../components/cardsNav"; */
import { CardOne } from "../components/card/cardOne"

import StoreContext from "../context/store";

import { getAll } from "./api/products"

export default function Home({ camas, brinquedos, cozinhas }) {
  const store = useContext(StoreContext)
  return (
    <>
      <Head>
        <title>{store.nome ? store.nome : 'Carregando...'}</title>
      </Head>
      {/* <CategoriesNav /> */}
      <Content padding="0">
        {/*  <Content bgWhite noShadow noFlex1> */}
        <CardsNav name={"Mais procurados"}>
          {camas.map((item) => {
            return <CardOne key={item.id} product={item} />
          })}
        </CardsNav>
        {/*  </Content> */}
        {/*  <Content bgWhite noShadow noFlex1 margin="1rem 0">
          <CardsNav name={"Camas"}>
            {camas.map((item) => {
              return <CardHome key={item.id} {...item} />
            })}
          </CardsNav>
        </Content> */}
      </Content>

      {/* <CardsNav name={"Brinquedos"}>
        {brinquedos.map((item) => {
          return <CardHome key={item.id} {...item} />
        })}
      </CardsNav>
      <CardsNav name={"Cozinhas"}>
        {cozinhas && cozinhas.map((item) => {
          return <CardHome key={item.id} {...item} />
        })}
      </CardsNav> */}
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