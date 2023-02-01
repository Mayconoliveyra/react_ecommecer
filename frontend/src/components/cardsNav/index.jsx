import styled from "styled-components"

const SectionSC = styled.section`
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
    margin-left: 15px;
    /* margin-top: 12px; */
    max-width: calc(100vw - 15px);
    overflow: hidden;
    [data-div="name"] {
        h2 {
            margin: 0px;
            font-size: ${({ theme }) => theme.font.sizes.medium};
            font-family: ${({ theme }) => theme.font.family.medium};
        }
    }
    [data-div="session-cards"] {
        display: flex;
        margin-top: 10px;
        overflow-x: scroll;
        ::-webkit-scrollbar,             
        ::-webkit-scrollbar-button,      
        ::-webkit-scrollbar-track,        
        ::-webkit-scrollbar-track-piece, 
        ::-webkit-scrollbar-thumb,       
        ::-webkit-scrollbar-corner {      
             background-color:transparent;
             height: 0px;
        }
    }
    [data-div="session-cards"]:last-child{
        margin-bottom: 10px;
    }
`
export default function CardsNav({ children, name }) {
    return (
        <SectionSC>
            <div data-div="name">
                <h2>{name}</h2>
            </div>
            <div data-div="session-cards">
                {children}
            </div>
        </SectionSC>
    )
}