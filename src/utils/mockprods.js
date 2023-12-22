import { faker } from "@faker-js/faker";


const randomProduct = () => {
    let prod = faker.commerce.product();
    return {
        _id: faker.database.mongodbObjectId(),
        title: prod,
        description: faker.commerce.productDescription({prod}),
        code: faker.string.uuid(),
        price: faker.number.int(1000),
        status: faker.datatype.boolean(),
        stock: faker.number.int({min: 20, max: 200}),
        category: faker.commerce.productAdjective(),
        thumbnails: ["./images/Without image"]
    };
};

export const randomProducts = () => {
    let quantity = 100;
    const products = [];
    for(let i = 0; i < quantity ; i++) {
        const random = randomProduct();
        products.push(random);
    };
    return products;
};