import styled from "styled-components";
import { Instagram, Facebook, Twitter, Youtube, Whatsapp, Messenger, EnvelopeAtFill } from "react-bootstrap-icons";
import Link from "next/link";
import { useContext } from "react";

import TemplateContext from "../../../context/template";
import StoreContext from "../../../context/store"

const NavSC = styled.footer`
    background-color: ${({ theme }) => theme.colors.secondaryColor};
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
                    color: #FFFFFF !important;
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
                    color: #FFFFFF !important;
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
                    <div id="attendance" data-div='attendance'>
                        <div>
                            <h5>Atendimento</h5>
                            <div>
                                {store.a_whatsapp &&
                                    <Link href={`https://api.whatsapp.com/send?phone=55${store.a_whatsapp.replace(/\D/g, '')}`} target={'_blank'}>
                                        <Whatsapp />
                                    </Link>
                                }
                                {store.a_messenger &&
                                    <Link href={`http://m.me/${store.a_messenger}`} target={'_blank'}>
                                        <Messenger />
                                    </Link>
                                }
                                {store.a_instagram &&
                                    <Link href={`https://ig.me/m/${store.a_instagram}`} target={'_blank'}>
                                        <Instagram />
                                    </Link>
                                }
                                {store.a_email &&
                                    <Link href={`mailto:${store.a_email}?subject=Atendimento`} target={'_blank'}>
                                        <EnvelopeAtFill />
                                    </Link>
                                }
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
                        {store.m_facebook &&
                            <Link href={`https://www.facebook.com/${store.m_facebook}`} target={'_blank'}>
                                <Facebook />
                            </Link>
                        }
                        {store.m_instagram &&
                            <Link href={`https://www.instagram.com/${store.m_instagram}`} target={'_blank'}>
                                <Instagram />
                            </Link>
                        }
                        {store.m_twitter &&
                            <Link href={`https://twitter.com/${store.m_twitter}`} target={'_blank'}>
                                <Twitter />
                            </Link>
                        }
                        {store.m_yutube &&
                            <Link href={`https://www.youtube.com/channel/${store.m_yutube}`} target={'_blank'}>
                                <Youtube />
                            </Link>
                        }
                    </div>
                </div>
            </div>
            <div data-div='terms'>
                <div>
                    <h6>
                        Todos os direitos reservados. Os preços anunciados podem ser alterados sem prévio aviso. A loja não é responsável por erros descritivos. As fotos contidas nesta página são meramente ilustrativas do produto e podem variar de acordo com o fornecedor/lote do fabricante.
                    </h6>
                </div>
            </div>
        </NavSC>
    )
}