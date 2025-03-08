import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { FinancialFormEntity } from '../entities/financial-form.entity';

export const FinancialFormPaginationConfigConst: PaginateConfig<FinancialFormEntity> =
  {
    searchableColumns: ['user.email'],
    select: [],
    where: undefined,
    sortableColumns: ['id', 'createdAt', 'updatedAt'],
    nullSort: 'last',
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['user', 'adviser', 'financialFormTime'],
    filterableColumns: {
      // Enable individual operators on a column
      id: [FilterOperator.EQ, FilterSuffix.NOT],

      // Enable all operators on a column
      userId: true,
    },
  };
