import Joi from "joi";

const userSchema = Joi.object ({
    userFName: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required(),
    userLName: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required(),
    userEmail: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: [ "com", "net" ]}})
        .required(),
    userAge: Joi.number()
        .integer()
        .min(18)
        .required()
});
export const userValidation = ({ first_name, last_name, email, age }) => {
    const report = userSchema.validateAsync ({ userFName: first_name, userLName: last_name, userEmail: email, userAge: age });
    return report;
};
const prodSchema = Joi.object ({
    prodTitle: Joi.string()
        .min(2)
        .max(15)
        .required(),
    prodPrice: Joi.number()
        .integer()
        .min(1)
        .required(),
    prodStock: Joi.number()
        .integer()
        .min(1)
        .required(),
    prodCategory: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required()
});
export const productValidation = ({ title, price, stock, category }) => {
    const report = prodSchema.validateAsync({ prodTitle: title, prodPrice: price, prodStock: stock, prodCategory: category });
    return report;
};

