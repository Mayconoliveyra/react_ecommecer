import Head from "next/head";
import { useContext } from "react";

import CategoriesNav from "../components/categoriesNav";
import CardsNav from "../components/cardsNav";
import { CardHome } from "../components/card/cardHome"

import StoreContext from "../context/store";

import { getAll } from "./api/products"

export default function Home({ camas, brinquedos, cozinhas }) {
  const store = useContext(StoreContext)
  return (
    <>
      <Head>
        <title>{store.nome ? store.nome : 'Carregando...'}</title>
      </Head>
      <CategoriesNav />
      <CardsNav name={"Camas"}>
        {camas.map((item) => {
          return <CardHome key={item.id} {...item} />
        })}
      </CardsNav>
      <CardsNav name={"Brinquedos"}>
        {brinquedos.map((item) => {
          return <CardHome key={item.id} {...item} />
        })}
      </CardsNav>
      <CardsNav name={"Cozinhas"}>
        {cozinhas && cozinhas.map((item) => {
          return <CardHome key={item.id} {...item} />
        })}
      </CardsNav>
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