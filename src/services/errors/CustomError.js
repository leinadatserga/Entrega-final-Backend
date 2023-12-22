

/*class CustomError {
    static createError ({ name = "Error", cause, message, code = 1 }){
        const error = new Error ( message, { cause });
        error.name = name;
        error.code = code;
        throw error;
    }
};*/


class CustomError extends Error {
    constructor ( message, statusCode ) {
        super ( message );
        this.statusCode = statusCode;
        Error.captureStackTrace ( this, CustomError );
    }
    static createError ({ name = "Error", cause, message, code = 1 }){
        const error = new CustomError ( message, { cause });
        error.name = name;
        error.code = code;
        throw error;
    }
    static BadRequest ( message = "Bad Request" ) {
        return new CustomError ( message, 400 );
    }
    static Unauthorized ( message = "Unauthorized" ) {
        return new CustomError ( message, 401 );
    }
    static Forbidden ( message = "Forbidden" ) {
        return new CustomError ( message, 403 );
    }
    static NotFound ( message = "Not Found" ) {
        return new CustomError ( message, 404 );
    }
    static InternalServerError ( message = "Internal Server Error" ) {
        return new CustomError ( message, 500 );
    }
}
export default CustomError;