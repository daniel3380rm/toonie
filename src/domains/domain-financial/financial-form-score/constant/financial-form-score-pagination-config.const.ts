import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { FinancialFormScoreEntity } from '../entities/financial-form-score.entity';

export const FinancialFormTimePaginationConfigConst: PaginateConfig<FinancialFormScoreEntity> =
  {
    searchableColumns: ['user.email'],
    select: [],
    where: undefined,
    sortableColumns: ['id', 'createdAt'],
    nullSort: 'last',
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['user', 'financialForm'],
    filterableColumns: {
      // Enable individual operators on a column
      id: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
