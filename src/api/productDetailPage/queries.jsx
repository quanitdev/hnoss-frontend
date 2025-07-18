import { useQuery } from '@tanstack/react-query';
import { getProductDetailAPI } from './request';
import { optionsUseQuery } from '../../utils/common';

export const useProductDetailUS = (id, option) => {
    return useQuery({
        queryKey: ['GetProductDetailAPI'],
        queryFn: () => getProductDetailAPI(id),
        optionsUseQuery,
        ...option,
    });
};

