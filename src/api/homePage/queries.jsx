import { useQuery } from '@tanstack/react-query';
import { getCategoriesAPI,  getProductsAPI, getBannersAPI } from './request';
import { optionsUseQuery } from '../../utils/common';

export const useGetCategoriesUS = (option) => {
    return useQuery({
        queryKey: ['getCategoriesAPI'],
        queryFn: () => getCategoriesAPI(),
        optionsUseQuery,
        ...option,
    });
};

export const useGetProductsUS = (option) => {
    return useQuery({
        queryKey: ['getProductsAPI'],
        queryFn: () => getProductsAPI(),
        optionsUseQuery,
        ...option,
    });
};

export const useGetBannersUS = (option) => {
    return useQuery({
        queryKey: ['getBannersAPI'],
        queryFn: () => getBannersAPI(),
        optionsUseQuery,
        ...option,
    });
};