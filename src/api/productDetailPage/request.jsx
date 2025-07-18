import axios from '../axios';


const END_POINT = {
    PRODUCTS: 'products',
};

export const getProductDetailAPI = async (id) => {
    const rs = await axios({
        url: `${END_POINT.PRODUCTS}/${id}` ,
        method: 'GET',
    });
    return rs;
};