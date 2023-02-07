import Head from "next/head";
import { useContext } from "react";

import { Content } from "../components/containe"
import { CardNavOne, CardNavTwo } from "../components/cardsNav";

import StoreContext from "../context/store";

import { getAll } from "./api/products"

export default function Home({ camas, brinquedos, cozinhas }) {
  const store = useContext(StoreContext)
  return (
    <>
      <Head>
        <title>{store.nome ? store.nome : 'Carregando...'}</title>
      </Head>
      <Content padding="0.5rem 0" noShadow>
        <CardNavOne title="Produtos que talvez possa lhe interessar" products={camas} />
        <CardNavTwo title="Produtos para Casa" products={brinquedos} />
        <CardNavOne title="Produtos em ofertas" products={cozinhas} />
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