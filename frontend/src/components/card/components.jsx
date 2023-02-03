import styled from "styled-components"
import Link from "next/link"

import { moneyMask } from "../../../masks"

const CardSC = styled.div`
    display: flex;
    flex-direction: column;
    
    background-color:${({ background }) => background};
    width:${({ width }) => width};
    height:${({ height }) => height};
    max-width: ${({ maxwidth }) => maxwidth};
    max-height: ${({ maxheight }) => maxheight};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
    @media (max-width: 720px){
        background-color:${({ nobackground }) => nobackground ? "" : "#f8f8f8"}; ;
        border-radius: 4px;
    }
`
const ImageSC = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;

    background-color:${({ background }) => background};
    width:${({ width }) => width};
    height:${({ height }) => height};
    max-width: ${({ maxwidth }) => maxwidth};
    max-height: ${({ maxheight }) => maxheight};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
    img {
        margin: 5px;
        max-width: 160px;
        max-height: 160px;
    }
`
const DescriptionSC = styled(Link)`
    padding: 0 5px;
    overflow: hidden;
    span{
        white-space: normal;
        display: inline-block;
        color: #0F1111;
        margin: 3px 0;
        font-size: 1rem;
        font-family:${({ theme }) => theme.font.family.medium};
    }

    background-color:${({ background }) => background};
    width:${({ width }) => width};
    height:${({ height }) => height};
    max-width: ${({ maxwidth }) => maxwidth};
    max-height: ${({ maxheight }) => maxheight};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
`
const PriceSC = styled(Link)`
    padding: 3px 5px;
    padding-bottom: 7px;
    display: flex;
    span:nth-child(1) {
        margin-right: 1px;
        position:relative;
        top: 0.1rem;
        font-size: 1rem;
        font-family: ${({ theme }) => theme.font.family.bold};
    }
    span:nth-child(2) {
        font-size: 1.5rem;
        font-family: ${({ theme }) => theme.font.family.medium};
    }
    span:nth-child(3) {
        position:relative;
        top: 0.6rem;
        font-size: 1.1rem;;
        text-decoration: line-through;
        color: #565959;
    }

    background-color:${({ background }) => background};
    width:${({ width }) => width};
    height:${({ height }) => height};
    max-width: ${({ maxwidth }) => maxwidth};
    max-height: ${({ maxheight }) => maxheight};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
`
const PromotionSC = styled.div`
    padding: 0 5px;
    margin: 7px 0;
    font-size: 0.9rem;
    [data="off"]{
        background: #CC0C39;
        color: #ffffff;
        padding: 4px 6px;
        border-radius: 2px;
        line-height: 16px;
        margin-right: 5px;
    }

    [data="oferta"]{
        font-family:${({ theme }) => theme.font.family.bold};
        color: #CC0C39;
    }

    background-color:${({ background }) => background};
    width:${({ width }) => width};
    height:${({ height }) => height};
    max-width: ${({ maxwidth }) => maxwidth};
    max-height: ${({ maxheight }) => maxheight};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
`

const Card = ({ children, height, width, maxwidth, maxheight, margin, padding, background, nobackground }) => {
    return (
        <CardSC height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background} nobackground={nobackground}>
            {children}
        </CardSC>
    )
}
const Image = ({ product, height, width, maxwidth, maxheight, margin, padding, background, nobackground }) => {
    return (
        <ImageSC href={`/produto/${product.id}`} height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
            <img src={product.url_img ? product.url_img : '/assets/images/default_product.png'} alt={product.alt ? product.alt : "Sem discrição"} />
        </ImageSC>
    )
}
const Description = ({ product, height, width, maxwidth, maxheight, margin, padding, background }) => {
    return (
        <DescriptionSC href={`/produto/${product.id}`} height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
            <span>{product.name}</span>
        </DescriptionSC>
    )
}
const Price = ({ product, height, width, maxwidth, maxheight, margin, padding, background }) => {
    return (
        <PriceSC href={`/produto/${product.id}`} height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
            {!!product.promotion ?
                (
                    <>
                        <span>R$</span>
                        <span>{moneyMask(product.price_promotion, false)}</span>
                        <span>{moneyMask(product.price)}</span>
                    </>


                ) : (
                    <>
                        <span>R$</span>
                        <span>{moneyMask(product.price, false)}</span>
                    </>
                )
            }
        </PriceSC>
    )
}
const Promotion = ({ product, height, width, maxwidth, maxheight, margin, padding, background }) => {
    if (product.promotion)
        return (
            <PromotionSC height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
                <span data="off">{(Number(product.price - product.price_promotion) / Number(product.price) * 100).toFixed(0)}% off</span> <span data="oferta">Oferta</span>
            </PromotionSC >
        )
}

export { Card, Image, Description, Price, Promotion }