import styled from "styled-components";
import { CaretUpFill, Instagram, Facebook, Messenger, Whatsapp, EnvelopeAtFill } from "react-bootstrap-icons";
import Link from "next/link";
const NavSC = styled.footer`
    margin-top:4rem;
    background-color: ${({ theme }) => theme.colors.secondaryColor};
    padding-bottom: 4rem;
    color: ${({ theme }) => theme.colors.primaryColor};
    [data-div='return-top']{
        padding: 0.5rem 0px;
        background: #37475A;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    [data-div='dev']{
        background-color: ${({ theme }) => theme.colors.primaryColor};
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
        /* backdrop-filter: brightness(60%); */
        max-width: ${({ theme }) => theme.width.large};
        text-align: center;
        margin: 0px auto;
        padding: 0.7rem 0.5rem;
        >div{
            padding: 0.3rem;
            h5{
                margin: 0px;
                margin-bottom: 1.3rem;
                font-size: 1.15rem;
                font-family:${({ theme }) => theme.font.family.bold};
            }
            svg {
                font-size: 2rem;
                margin: 0 1rem;
            }
        }
    }
    [data-div='terms']{
        /* backdrop-filter: opacity(20%); */
        padding: 1rem 1rem;
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
    return (
        <NavSC>
            <div data-div='return-top'> <CaretUpFill />
                Voltar ao Topo da página
            </div>
            <div data-div='exibir'>
                <div data-div='midias'>
                    <h5>Mídias sociais</h5>
                    <div>
                        <Facebook />
                        <Instagram />
                        <Messenger />
                        <Whatsapp />
                        <EnvelopeAtFill />
                    </div>
                </div>

                <div data-div='termos'>
                    <h6>
                        Todos os direitos reservados. Os preços anunciados podem ser alterados sem prévio aviso. A loja não é responsável por erros descritivos. As fotos contidas nesta página são meramente ilustrativas do produto e podem variar de acordo com o fornecedor/lote do fabricante.
                    </h6>
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
                            <img src={'/assets/images/softconnect.png'} alt={'Softconnect'} />
                        </Link>
                    </div>
                    <div>
                        <Link href="/">
                            <img src={'/assets/images/selo_empresabuscape_horizontal.png'} alt={'selo Empresa Buscapé'} />
                        </Link>
                    </div>
                </div>
            </div>
            <div data-div='media'>
                <div>
                    <h5>Mídias sociais</h5>
                    <div>
                        <Facebook />
                        <Instagram />
                        <Messenger />
                        <Whatsapp />
                        <EnvelopeAtFill />
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