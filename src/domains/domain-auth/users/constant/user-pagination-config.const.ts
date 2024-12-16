import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { UserEntity } from '../entities/user.entity';

export const UserPaginationConfigConst: PaginateConfig<UserEntity> = {
  searchableColumns: ['email', 'phoneNumber'],
  select: [],
  where: undefined,
  sortableColumns: ['id', 'createdAt', 'updatedAt'],
  nullSort: 'last',
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['profile'],
  filterableColumns: {
    // Enable individual operators on a column
    id: [FilterOperator.EQ, FilterSuffix.NOT],
    email: [FilterOperator.EQ, FilterSuffix.NOT],
    phoneNumber: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
