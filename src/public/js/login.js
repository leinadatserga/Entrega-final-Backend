const socket = io ();
let response = "User OK";
socket.on ( "conf", ( confirm ) => {
    if ( !confirm ) {
        response = "User data error";
    }
    socket.emit ( "response", response )
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
        console.log("La miercoles!", reqLogin);
        return reqLogin.status;
    } catch (error) {
        console.log(error);
    }
};
const formLogin = document.getElementById ( "loginForm" );
formLogin.addEventListener ( "submit", async ( e ) => {
    e.preventDefault ();
    const formData = new FormData ( e.target );
    const userData = Object.fromEntries ( formData );
    try {
        await request ( userData );
    } catch (error) {
        console.log(error);
    };    
    socket.emit ( "newUser", userData );
    e.target.reset ();
});
