import styled from "styled-components"

const ContentSC = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    max-width:${({ maxwidth }) => maxwidth};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
`
const ContentWhiteSC = styled.div`
    background-color: #ffffff;
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
`
const ContentBorderSC = styled.div`
    border: 1px #D5D9D9 solid;
    color: #0F1111;
    border-radius:${({ borderRadius }) => borderRadius};
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};

    [data="title"]{
      h3{
        color: #0F1111;
        font-size: ${({ theme }) => theme.font.sizes.large};
        font-family: ${({ theme }) => theme.font.family.bold};
      }
    }

    [data="table-1"]{
        width: 100%;
        border-collapse: collapse;
        tr{
            td{
                padding: 0.3rem 0.4rem;
                font-size:1.2rem;
            }
            [data="td-value"]{
                text-align:right;
            }
            [data="td-bold"]{
                padding-top: 0.4rem;
                font-family: ${({ theme }) => theme.font.family.bold};
                color: #0F1111;
                font-size: 1.2rem;
            }
            [data="td-red"]{
                padding-top: 0.4rem;
                font-family: ${({ theme }) => theme.font.family.bold};
                color: #B12704;
                text-align:right;
                font-size: 1.2rem;
            }
        }
    }
    
    [data="font-1.2"]{
        font-size: 1.2rem;
    }
    [data="p-info"]{
        margin: 0.5rem;
        font-size: 1rem !important;
        a{
        text-decoration: underline;
        color: #0066c0;
        font-family:${({ theme }) => theme.font.family.medium};
        font-size: 0.9rem !important;
        }
    }
`
const ContentHeaderSC = styled.div`
    color: #0F1111;
    display: flex;
    align-items: center;
    margin:${({ margin }) => margin};
    padding:${({ padding }) => padding};
    a{
        flex:1;
        display: flex;
        align-items: center;
    }
    [data="icon-left"]{
        font-size: 1rem;
        margin-right: 0.5rem;
        
    }  
    [data="h2-title"]{
            font-size: 1.3rem;
            font-family:${({ theme }) => theme.font.family.bold};
    }
`
/* DIV principal a ser exibido na tela, fica dentro da Main. */
const Content = ({ maxwidth, margin, padding, children }) => {
    return (
        <ContentSC maxwidth={maxwidth} margin={margin} padding={padding} >
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
const ContentBorder = ({ children, margin, padding, borderRadius }) => {
    return (
        <ContentBorderSC margin={margin} padding={padding} borderRadius={borderRadius}>
            {children}
        </ContentBorderSC>
    )
}
const ContentHeader = ({ children, margin, padding }) => {
    return (
        <ContentHeaderSC margin={margin} padding={padding}>
            {children}
        </ContentHeaderSC>
    )
}

export { Content, ContentWhite, ContentBorder, ContentHeader }