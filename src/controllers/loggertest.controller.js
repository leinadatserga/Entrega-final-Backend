import logger from "../utils/logger.js";


export const loggerTest = async ( req, res ) => {
        logger.debug ( `This is a test for logger level debug` );
        logger.http ( `This is a test for logger level http` );
        logger.info ( `This is a test for logger level info` );
        logger.warning ( `This is a test for logger level warning` );
        logger.error ( `This is a test for logger level error` );
        logger.fatal ( `This is a test for logger level fatal` );
            return res.status ( 200 ).send ( "ok" );
};