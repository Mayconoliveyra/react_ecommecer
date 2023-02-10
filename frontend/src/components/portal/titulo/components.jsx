import styled from "styled-components"

const TitleSC = styled.section`
    display: flex;
    @media (max-width: 720px){
            flex-direction: column;
    }
    justify-content: space-between;
    background: #fbfbfb;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 10%);
    padding: 15px 15px 10px 20px;
    h1{
        font-size: 1.3rem;
        font-family: ${({ theme }) => theme.font.family.regular};
    }
    [data="ol-li"]{
        display: flex;
        @media (max-width: 720px){
            margin-top: 0.3rem;
            background: #efefef;
            padding: 0.5rem;
            border-radius: 2px;
        }
        li{
            display: flex;
            align-items: center;
            a{
                display: flex;
                align-items: center;
                font-size: 0.8rem;
                padding: 0.3rem 0;
                padding-right: 0.4rem;
            }
        }
        [data="ativo"]{
            color: #999999;
        }
    }
`;
const TitleOne = ({ title, icon, children }) => {
    return (
        <TitleSC>
            <h1>{icon} {title}</h1>
            <ol data="ol-li">
                {children}
            </ol>
        </TitleSC>
    )
}
export { TitleOne }