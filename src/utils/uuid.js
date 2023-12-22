export const uCode = () => {
    let a = Date.now ().toString ( 33 ).substring ( 5 );
    let b = Math.random ().toString ( 25 ).substring ( 2 );
    let c = (( parseInt ( a, 33 )) + ( parseInt ( b, 25 ))).toString ( 35 );
    const uuid = `${ a }_${ b }_${ c }`;
    return uuid;
};      