import styled from "styled-components";
import { CaretUpFill, Instagram, Facebook, Twitter, Youtube, Whatsapp, Messenger, EnvelopeAtFill } from "react-bootstrap-icons";
import Link from "next/link";
import { useContext } from "react";

import TemplateContext from "../../../context/template";
import StoreContext from "../../../context/store"

const NavSC = styled.footer`
    margin-top:4rem;
    background-color: ${({ theme }) => theme.colors.secondaryColor};
    padding-bottom: 4rem;
    color: ${({ theme }) => theme.colors.primaryColor};
    [data-div='return-top']{
        display: flex;
        background: #37475A;
        a{
            margin:0 auto;
            font-size: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            padding: 0.7rem 4rem;
        }
    }
    [data-div='attendance']{
        backdrop-filter: brightness(65%);
        padding: 1.5rem 0.5rem;
        >div{
            max-width: ${({ theme }) => theme.width.large};
            margin: 0px auto;
            padding: 0.3rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            h5{
                white-space: nowrap;
                margin: 0px;
                font-size: 1.2rem;
                font-family:${({ theme }) => theme.font.family.bold};
            }
            div {
                display: flex;
                align-items: center;
                margin-top: 2rem;
                svg{
                    font-size: 2rem;
                    margin: 1.5rem 1.6rem;
                }   
            } 
            p{
                text-align:center;
                padding-top: 1rem;
            }     
        }
    }
    [data-div='dev']{
        background-color: #FFFFFF;
        padding: 1rem;
        >div {
            max-width:${({ theme }) => theme.width.large};
            margin: 0px auto;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem; 
            div{
                img {
                    max-height: 4rem;
                    max-width: 100%;
                }
            }
        }
    }
    [data-div='media']{
        backdrop-filter: brightness(65%);
        padding: 1.5rem 0.5rem;
        >div{
            max-width: ${({ theme }) => theme.width.large};
            margin: 0px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            h5{
                white-space: nowrap;
                margin: 0px;
                font-size: 1.2rem;
                font-family:${({ theme }) => theme.font.family.bold};
            }
            div {
                margin-top: 1rem;
                display: flex;
                align-items: center;
                svg{
                    font-size: 2rem;
                    margin: 1.5rem 1.6rem;
                }   
            }          
        }
    }
    [data-div='terms']{
        backdrop-filter: brightness(60%);
        padding: 1rem;
        div {
            max-width:${({ theme }) => theme.width.large};
            margin: 0px auto;
            h6{
                text-align:center;
                font-size: 0.8rem;
                color: ${({ theme }) => theme.colors.primaryColor};
                font-family:${({ theme }) => theme.font.family.medium};
            }
        }
    }
`
export default function Footer() {
    const { template } = useContext(TemplateContext)
    const store = useContext(StoreContext)

    return (
        <NavSC>
            {!template.footerReduce && (
                <>
                    {/* <div data-div='return-top'>
                        <Link href="#exibir-header">
                            <CaretUpFill />
                            Voltar ao Topo da página
                        </Link>
                    </div> */}
                    <div id="attendance" data-div='attendance'>
                        <div>
                            <h5>Atendimento</h5>
                            <div>
                                <Link href="https://api.whatsapp.com/send?phone=558399675920" target={'_blank'}>
                                    <Whatsapp />
                                </Link>
                                <Link href="http://m.me/maycon.deyved" target={'_blank'}>
                                    <Messenger />
                                </Link>
                                <Link href={`https://ig.me/m/${store.a_instagram}`} target={'_blank'}>
                                    <Instagram />
                                </Link>
                                <Link href={`mailto:${store.a_email}?subject=Atendimento`} target={'_blank'}>
                                    <EnvelopeAtFill />
                                </Link>
                            </div>
                            <p>
                                {store.logradouro}, {store.numero} - {store.bairro}, {store.localidade} - {store.uf}, {store.cep}
                            </p>
                        </div>
                    </div>
                    <div data-div='dev'>
                        <div>
                            <div>
                                <Link href="/">
                                    <img src={'/assets/images/selo-google-site-seguro.png'} alt={'Selo Google Site Seguro'} />
                                </Link>
                            </div>
                            <div>
                                <Link href="/">
                                    <img src={'/assets/images/selo_empresabuscape_horizontal.png'} alt={'selo Empresa Buscapé'} />
                                </Link>
                            </div>
                            <div>
                                <Link href="/">
                                    <img src={'/assets/images/softconnect.png'} alt={'Softconnect'} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div data-div='media'>
                <div>
                    <h5>Mídias sociais</h5>
                    <div>
                        <Link href={`https://www.facebook.com/${store.midia_facebook}`} target={'_blank'}>
                            <Facebook />
                        </Link>
                        <Link href={`https://www.instagram.com/${store.midia_instagram}`} target={'_blank'}>
                            <Instagram />
                        </Link>
                        <Link href={`https://twitter.com/${store.midia_twitter}`} target={'_blank'}>
                            <Twitter />
                        </Link>
                        <Link href={`https://www.youtube.com/channel/${store.midia_yutube}`} target={'_blank'}>
                            <Youtube />
                        </Link>
                    </div>
                </div>
            </div>
            <div data-div='terms'>
                <div>
                    <h6>
                        {store.termo_uso}
                    </h6>
                </div>
            </div>
        </NavSC>
    )
}