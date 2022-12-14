export const CardFooter = ({ product }) => {
    return (
        <div data-div="actions">
            <div>
                <div data-div="input-div">
                    <button type="button" onClick={() => handleQuantity(Number(quantity - 1))}><Dash /></button>
                    <input ref={refQuantily} type="number" id="quantity" value={quantity} onChange={handleQuantity} />
                    <button type="button" onClick={() => handleQuantity(Number(quantity + 1))}><Plus /></button>
                </div>
                <div data-div="btn-div">
                    Adicionar  <span>{!!product.promotion ? moneyMask(product.price_promotion) : moneyMask(product.price)} </span>
                </div>
            </div>
        </div>
    )
}