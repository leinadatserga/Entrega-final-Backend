import config from "../config/config.js";
import bcrypt from "bcrypt";

export const createHash = ( password ) => bcrypt.hashSync ( password, bcrypt.genSaltSync ( parseInt ( config.salt )))

export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)
