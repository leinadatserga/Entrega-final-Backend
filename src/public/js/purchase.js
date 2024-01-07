const socket = io ();
const hideNavbar = () => {
    const navbar = document.querySelector ( ".navbar" );
    if ( navbar ) {
      navbar.style.display = "none";
    }
};
hideNavbar ();
const purchaseResult1 = document.querySelector ( ".purchaseResult1" );
const purchaseResult2 = document.querySelector ( ".purchaseResult2" );
const purchaseResult3 = document.querySelector ( ".purchaseResult3" );
socket.on ( "purchase", async ( userCart ) => {
    await request ( userCart );
});
socket.on ( "purchaseResult", async ( userTicket ) => {
    purchaseResult1.textContent = `El código identificador de tu compra es: ${ userTicket.code }`;
    purchaseResult2.textContent = `Total de la compra: U$D ${ userTicket.amount }`;
    purchaseResult3.textContent = `Se te notificará al mail: ${ userTicket.purchaser }`;
});
const request = async ( cart ) => {
    try {
        const newOrder = await fetch ( `http://localhost:8080/api/carts/${ cart }/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });
        await socket.emit ( "orderConf" );
        return newOrder.status;
    } catch ( error ) {
        throw error;
    }
};

