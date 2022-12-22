import styled from "styled-components"
const ImgCardSC = styled.div`
    display: flex;
    justify-content:center;
    padding: 0.5rem;
    @media (min-width: ${({ theme }) => theme.width.medium}){
        padding: 0.5rem 1rem;
    }
    img {
        max-width: 145px;
        max-height: 135px;
    }
`
export const ImgCard = ({ product }) => {
    return (
        <ImgCardSC>
            <img src={product.url_img ? product.url_img : '/assets/images/default_product.png'} alt={product.alt ? product.alt : "Sem discrição"} />
        </ImgCardSC>
    )
}