const socket = io ();
let response;
socket.on ( "conf", ( confirm ) => {
    if ( !confirm ) {
        response = "User data error/unauthorized";
    } else {
        response = "User OK";
    }
    socket.emit ( "response", response );
    response == "User OK" ? redirectToProducts () : redirectToLogin ();
});
const request = async ( userDat ) => {
    try {
        const reqLogin = await fetch ( "http://localhost:8080/api/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ( userDat )
        });
        return reqLogin.status;
    } catch ( error ) {
        throw error;
    }
};
const redirectToLogin = () => {
    window.location.href = "/static/login";
};
  
const redirectToProducts = () => {
    window.location.href = "/static/products";
};
const formLogin = document.getElementById ( "loginForm" );
formLogin.addEventListener ( "submit", async ( e ) => {
    e.preventDefault ();
    const formData = new FormData ( e.target );
    const userData = Object.fromEntries ( formData );
    try {
        await request ( userData );
    } catch ( error ) {
        throw ( error );
    };    
    socket.emit ( "newUser", userData );
    e.target.reset ();
});
