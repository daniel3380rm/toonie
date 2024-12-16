import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { FinancialFormTimeEntity } from '../entities/financial-form-time.entity';

export const FinancialFormTimePaginationConfigConst: PaginateConfig<FinancialFormTimeEntity> =
  {
    searchableColumns: ['time'],
    select: [],
    where: undefined,
    sortableColumns: ['id', 'time'],
    nullSort: 'last',
    defaultSortBy: [['time', 'ASC']],
    relations: ['user'],
    filterableColumns: {
      time: [FilterOperator.EQ, FilterOperator.GT, FilterOperator.LT],
      status: [FilterOperator.EQ],
      // Enable individual operators on a column
      id: [FilterOperator.EQ, FilterSuffix.NOT],
      userId: true,
    },
  };
