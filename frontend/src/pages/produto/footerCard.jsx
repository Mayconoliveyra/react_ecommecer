import styled from "styled-components"

const FootCardSC = styled.footer`
    position: fixed;
    bottom: 0px;
    width: 100%;
    border-top: solid 1px #EDEDED;
    opacity: 999;
    border-top: solid 1px #d6d6d6;
    background-color: #FFFFFF;
    div {
        display: flex;
        padding: 0.6rem;
        max-width: 500px;
        width:100%;
        margin: 0px auto;
    }

    [data-div="input-div"] {
        background-color: #FFFFFF;
        border: solid 1px #DCDCDC;
        border-radius: 4px;
        display: flex;
        max-width: 40%;
        input {
            font-size:${({ theme }) => theme.font.sizes.large};
            width: 100%;
            text-align:center;
            padding: 0px;
            margin: 0px;
            border: none;
        }
        button {
            font-size:${({ theme }) => theme.font.sizes.xlarge};
            color: ${({ theme }) => theme.colors.secondaryColor};
            font-family: ${({ theme }) => theme.font.family.bold};
            background-color: transparent;
            border: none;
            padding: 0% 7%;
            display: flex;
            align-items: center;
        }
    }

    [data-div="btn-div"] {
        white-space: nowrap;
        border-radius: 4px;
        color: #FFFFFF;
        background-color: ${({ theme }) => theme.colors.secondaryColor};
        font-size:${({ theme }) => theme.font.sizes.small};
        display: flex;
        align-items: center;
        padding:  0rem 1rem;
        max-width: 50%;
        width:100%;
        margin-left: 10%;
        span {
            margin: 0px;
            padding: 0px;
            margin-left: auto;
        }
    }
`

export const FootCard = ({ children }) => {
    return (
        <FootCardSC>
            {children}
        </FootCardSC>
    )
}