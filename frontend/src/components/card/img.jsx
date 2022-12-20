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
export const ImgCard = ({ src = '/assets/images/default_product.png', alt = "imagem sem nome" }) => {
    return (
        <ImgCardSC>
            <img src={src} alt={alt} />
        </ImgCardSC>
    )
}