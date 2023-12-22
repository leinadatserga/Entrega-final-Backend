const socket = io ();
import logger from "../../utils/logger";


const formReg = document.getElementById ( "registerForm" );
formReg.addEventListener ( "submit", ( e ) => {
    e.preventDefault ();
    const formData = new FormData ( e.target );
    const clientData = Object.fromEntries ( formData );
    socket.emit ( "newCient", clientData );
    e.target.reset ();
    socket.on ( "conf", ( confirm ) => {
        if ( confirm ) {
            logger.debug( "User OK" );
        } else {
            logger.debug( "User data error" );
        }
    })
});
