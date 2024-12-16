import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFinancialFormScoreDto } from '../dto/create-financial-form-score.dto';
import { FinancialFormScoreEntity } from '../entities/financial-form-score.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { FinancialFormTimePaginationConfigConst } from '../constant/financial-form-score-pagination-config.const';
import { FinancialFormScoreErrors } from '../enums/financial-form-score.enum';
import { EntityCondition } from 'src/common/types/entity-condition.type';
import { FinancialFormService } from '../../financial-form/services/financial-form.service';

@Injectable()
export class FinancialFormScoreService {
  constructor(
    @InjectRepository(FinancialFormScoreEntity)
    private readonly financialFormScoreRepository: Repository<FinancialFormScoreEntity>,
    private readonly financialFormService: FinancialFormService,
  ) {}

  async create(createDto: CreateFinancialFormScoreDto) {
    const { financialId, score, userId } = createDto;
    await this.financialFormService.findOne({
      id: financialId,
      userId: userId,
    });
    const userScore = await this.findOne({ id: financialId, userId: userId });
    if (userScore) {
      throw new NotFoundException(
        FinancialFormScoreErrors.NOT_ACCEPTABLE_SCORE,
      );
    }
    await this.financialFormScoreRepository.save({
      financialId,
      score,
      userId,
    });
    return true;
  }

  async findAllWithUserId(
    userId: number,
    query: PaginateQuery,
  ): Promise<Paginated<FinancialFormScoreEntity>> {
    return await paginate(query, this.financialFormScoreRepository, {
      ...FinancialFormTimePaginationConfigConst,
      where: { userId },
    });
  }

  async findOne(fields: EntityCondition<FinancialFormScoreEntity>) {
    const financialFormFound = await this.financialFormScoreRepository.findOne({
      where: fields,
    });
    if (!financialFormFound)
      throw new NotFoundException(FinancialFormScoreErrors.NOT_FOUND);
    return financialFormFound;
  }
}
