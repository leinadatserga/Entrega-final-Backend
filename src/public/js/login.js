const socket = io ();
import logger from "../../utils/logger";


const formLogin = document.getElementById ( "loginForm" );
formLogin.addEventListener ( "submit", ( e ) => {
    e.preventDefault ();
    const formData = new FormData ( e.target );
    const userData = Object.fromEntries ( formData );
    socket.emit ( "newUser", userData );
    e.target.reset ();
    socket.on ( "conf", ( confirm ) => {
        if ( confirm ) {
            logger.debug( "User OK" );
        } else {
            logger.debug( "User data error" );
        }
    })
});
