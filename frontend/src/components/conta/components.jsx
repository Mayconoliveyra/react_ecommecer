import Link from "next/link"
import styled from "styled-components"
import { ChevronLeft } from "react-bootstrap-icons";

const ContentSC = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 40rem;
    width: 100%;
    margin: 0 auto;
    padding: 0 0.3rem;
`
const ContentWhiteSC = styled.div`
    background-color: #ffffff;
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
`
const HeaderSC = styled.div`
    color: #0F1111;
    [data="title"]{
            padding: 1.3rem;
            display: flex;
            align-items: center;
        svg{
            font-size: 1.1rem;
            margin-right: 0.5rem;
            color: #067d62;
        }
        h1{
            font-size: 1.3rem;
            font-family:${({ theme }) => theme.font.family.bold};
            margin: 0px;
            padding: 0px;
        }
    };
`

const Content = ({ children }) => {
    return (
        <ContentSC>
            {children}
        </ContentSC>
    )
}
const ContentWhite = ({ children, margin, padding }) => {
    return (
        <ContentWhiteSC margin={margin} padding={padding}>
            {children}
        </ContentWhiteSC>
    )
}
const Header = ({ title }) => {
    return (
        <HeaderSC>
            <div data="title">
                <ChevronLeft />
                <h1>
                    {title}
                </h1>
            </div>
        </HeaderSC>
    )
}



export { Content, ContentWhite, Header }