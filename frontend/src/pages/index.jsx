import { getAll } from "../adapters/products"

import CategoriesNav from "../components/categoriesNav";
import CardsNav from "../components/cardsNav";
import Card from "../components/card";

export default function Home({ camas, brinquedos, cozinhas }) {
  return (
    <>
      <CategoriesNav />
      <CardsNav name={"Camas"}>
        {camas.map((item) => {
          return <Card key={item.id} {...item} />
        })}
      </CardsNav>
      <CardsNav name={"Brinquedos"}>
        {brinquedos.map((item) => {
          return <Card key={item.id} {...item} />
        })}
      </CardsNav>
      <CardsNav name={"Cozinhas"}>
        {cozinhas && cozinhas.map((item) => {
          return <Card key={item.id} {...item} />
        })}
      </CardsNav>
    </>
  );
}

export async function getServerSideProps() {
  const data = await getAll()
    .then((res) => res.data)

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { ...data },
  }
}