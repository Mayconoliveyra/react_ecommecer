import styled from "styled-components"
import Link from "next/link"

import { moneyMask } from "../../../masks"

const CardSC = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    
    background-color:${({ background }) => background};
    width:${({ width }) => width};
    height:${({ height }) => height};
    max-width: ${({ maxwidth }) => maxwidth};
    max-height: ${({ maxheight }) => maxheight};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
    border:${({ border }) => border};
    @media (max-width: 720px){
        background-color:${({ nobackground }) => nobackground ? "" : "#f8f8f8"}; ;
        border-radius: 4px;
    }
    padding-bottom: 4px;
`
const ImageSC = styled(Link)`
    [data="img-img"]{
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

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp:${({ height }) => height ? "1" : ''};
        -webkit-box-orient: vertical;
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
    color: #0F1111 !important;
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
const BtnAddSC = styled(Link)`
    display: flex;
    text-align: center;
    justify-content: center;
    border-radius: 0.3rem;
    padding: 0.7rem 1rem;
    margin: 0 0.2rem;
    margin-top:auto;
    color: #0F1111 !important;

    background: #FFD814;
    border-color: #FCD200;  
    
    background-color:${({ background }) => background};
    width:${({ width }) => width};
    height:${({ height }) => height};
    max-width: ${({ maxwidth }) => maxwidth};
    max-height: ${({ maxheight }) => maxheight};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
`

const Card = ({ children, height, width, maxwidth, maxheight, margin, padding, background, nobackground, border }) => {
    return (
        <CardSC height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background} nobackground={nobackground} border={border}>
            {children}
        </CardSC>
    )
}
const Img = ({ product, height, width, maxwidth, maxheight, margin, padding, background }) => {
    return (
        <ImageSC href={`/produto/${product.id}`} height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
            <div data="img-img">
                <img src={product.url_img ? product.url_img : '/assets/images/default_product.png'} title={product.nome ? product.nome : "Sem descrição"} alt={product.nome ? product.nome : "Sem descrição"} />
            </div>
        </ImageSC>
    )
}
const Description = ({ product, height, width, maxwidth, maxheight, margin, padding, background }) => {
    return (
        <DescriptionSC href={`/produto/${product.id}`} height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
            <span>{product.nome}</span>
        </DescriptionSC>
    )
}
const Price = ({ product, height, width, maxwidth, maxheight, margin, padding, background }) => {
    return (
        <PriceSC href={`/produto/${product.id}`} height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
            {product.promocao_ativa == 'Sim' ?
                (
                    <>
                        <span>R$</span>
                        <span>{moneyMask(product.preco_promocao, false)}</span>
                        <span>{moneyMask(product.preco)}</span>
                    </>


                ) : (
                    <>
                        <span>R$</span>
                        <span>{moneyMask(product.preco, false)}</span>
                    </>
                )
            }
        </PriceSC>
    )
}
const Promotion = ({ product, height, width, maxwidth, maxheight, margin, padding, background }) => {
    if (product.promocao_ativa == 'Sim')
        return (
            <PromotionSC height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
                <span data="off">{(Number(product.preco - product.preco_promocao) / Number(product.preco) * 100).toFixed(0)}% off</span> <span data="oferta">Oferta</span>
            </PromotionSC >
        )
}
const BtnAdd = ({ product, height, width, maxwidth, maxheight, margin, padding, background }) => {
    return (
        <BtnAddSC href={`/produto/${product.id}`} height={height} width={width} maxwidth={maxwidth} maxheight={maxheight} margin={margin} padding={padding} background={background}>
            Adicionar
        </BtnAddSC>
    )
}
export { Card, Img, Description, Price, Promotion, BtnAdd }