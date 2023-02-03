import Head from "next/head";
import { useContext } from "react";

import { Content } from "../components/containe"
import { CardsNavOne } from "../components/home/components"
import { CardHomeOne } from "../components/card/cards"

import StoreContext from "../context/store";

import { getAll } from "./api/products"

export default function Home({ camas, brinquedos, cozinhas }) {
  const store = useContext(StoreContext)
  return (
    <>
      <Head>
        <title>{store.nome ? store.nome : 'Carregando...'}</title>
      </Head>
      <Content padding="0" noShadow>
        <CardsNavOne name="Produtos que talvez possa lhe interessar">
          {camas.map((item) => {
            return <CardHomeOne key={item.id} product={item} />
          })}
        </CardsNavOne>
       {/*  <CardsNavOne name="Produtos em ofertas">
          {camas.map((item) => {
            return <CardHomeOne key={item.id} product={item} />
          })}
        </CardsNavOne> */}
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