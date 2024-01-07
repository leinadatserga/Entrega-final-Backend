const socket = io ();
let cartTotal = 0;
let quantity = 0;
let productId;
let cart = [];
let prodId;
let userLogged;
let user;
  
socket.on("sessionStatus", ( confirm, userDats ) => {
    userLogged = confirm;
    user = userDats;
    updateButtonContent ();
});
const request = async ( userDat, cart ) => {
    try {
        const cartReady = await fetch ( `http://localhost:8080/api/carts/${ userDat }`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ( cart )
        });
        return cartReady.status;
    } catch ( error ) {
        throw error;
    }
};
const addToCartButtons = document.querySelectorAll ( ".addToCart" );
const purchaseButton = document.getElementById ( "finalizarCompra" );
const prodsButton = document.getElementById ( "agregarProductos" );
const updateCart = ( product ) => {
    if ( cart.length == 0 ) {
        let item = { id_prod: product, quantity: 1 };
        cart.push ( item );
    } else {
    prodId = cart.find ( element => ( element.id_prod == product ));
        if ( !prodId ) {
            let item = { id_prod: product, quantity: 1 };
            cart.push ( item );
        } else {
            let item = prodId;
            prodId.quantity ++;
            item.quantity = prodId.quantity;
        }
    }
}
const updateButtonContent = () => {
    prodsButton.textContent = `TU CARRITO - Productos: ${ quantity }, Total: U$D ${ cartTotal.toFixed ( 2 )} + IVA`;
}
const redirectToLogin = () => {
    window.location.href = "/static/login";
};
const redirectToPurchase = () => {
    window.location.href = "/static/purchase";
};
addToCartButtons.forEach ( button => {
    button.addEventListener ( "click", () => {
        const price = parseFloat ( button.getAttribute ( "price" ));
        const idProd =  ( button.getAttribute ( "idProd" ));
        quantity ++;
        cartTotal += price;
        updateButtonContent ();
        updateCart ( idProd )
    });
});
purchaseButton.addEventListener ( 'click', function () {
    cartTotal == 0 ? window.location.href = "/static/products" : "";
    if ( userLogged && user ) {
        request ( user, cart );
        setTimeout (() => {
            redirectToPurchase ();
        }, 5000 );
    } else {
        setTimeout (() => {
            redirectToLogin ();
        }, 5000 );
    }
});
updateButtonContent ();