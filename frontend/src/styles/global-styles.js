import { createGlobalStyle, css } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'roboto-regular';
    src: url('/assets/font/Roboto-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'roboto-medium';
    src: url('/assets/font/Roboto-Medium.ttf') format('truetype');
  }
  @font-face {
    font-family: 'roboto-bold';
    src: url('/assets/font/Roboto-Bold.ttf') format('truetype');
  }

  * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
  }

  @media (max-width: 1080px){
    html{
      font-size: 93.75%; /* Converter o tamanho da font px 15 */
    }
  }
  @media (max-width: 720px){
    html{
      font-size: 87.5%; /* Converter o tamanho da font px 14 */
    }
  }
  body{
    background-color: #FFFFFF;
    min-height: 100vh;
  }
  
  body, input, textarea, select, button, a{
    font-size: ${({ theme }) => theme.font.sizes.xsmall};
    font-family: ${({ theme }) => theme.font.family.regular};
    color:  #333333; 
  }
  #__next {
    min-height: 100vh;
  }

  main {
    max-width: 1120px;
    width: 100%;
    margin: 0px auto;
    min-height: 160vh;
  }
 
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.font.family.medium};
    margin: ${({ theme }) => theme.spacings.xsmall} 0;
    font-weight: normal;
  }
  p {
    margin: ${({ theme }) => theme.spacings.medium} 0;
  }
  ul, ol {
    margin: ${({ theme }) => theme.spacings.medium};
    padding: ${({ theme }) => theme.spacings.medium};
  }
  li{
    list-style-type: none;
  }

  a,button,input,textarea {
    cursor: pointer;
    text-decoration:none;
    color: inherit;
    outline: none;
  }
  textarea {
    border: solid 1px #B8B8B8;
  }
  button {
    border: none;
    &:disabled {
      background-color:#efefef4d !important;
      color:#1010104d !important;
      border: 1px solid #7676764d !important;
      opacity: 100% !important;
    }
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
