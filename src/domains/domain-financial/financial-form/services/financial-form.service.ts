import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFinancialFormDto } from '../dto/create-financial-form.dto';
import { FinancialFormEntity } from '../entities/financial-form.entity';
import { FinancialFormErrors } from '../enums/financial-form-messages.enum';
import { FinancialFormResponseDto } from '../dto/financial-form-response.dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { FinancialFormPaginationConfigConst } from '../constant/financial-form-pagination-config.const';
import { UpdateFinancialFormDto } from '../dto/update-financial-form.dto';
import { EntityCondition } from '../../../../common/types/entity-condition.type';
import { FinancialFormTimeService } from '../../financial-form-time/services/financial-form-time.service';
import { ItemStatusFinancialFormTime } from '../../financial-form-time/enums/item-status-financial-form-time.enum';
import { UsersService } from 'src/domains/domain-auth/users/services/users.service';
import { generateReferralCode } from 'src/common/helper';
import { UpdateStatusFinancialFormDto } from '../dto/update-status-financial-form.dto';

@Injectable()
export class FinancialFormService {
  constructor(
    @InjectRepository(FinancialFormEntity)
    private readonly financialFormRepository: Repository<FinancialFormEntity>,
    private readonly financialFormTimeService: FinancialFormTimeService,
    private readonly usersService: UsersService,
  ) {}

  async create(createDto: CreateFinancialFormDto) {
    const { financialFormTimeId } = createDto;
    const time = await this.financialFormTimeService.findOne({
      id: financialFormTimeId,
      status: ItemStatusFinancialFormTime.Pending,
    });
    const trackingCode = generateReferralCode();

    const financialFormIns = this.financialFormRepository.create({
      ...createDto,
      adviserId: time.userId,
      trackingCode,
      financialFormTimeId: financialFormTimeId,
    });
    const financialFormSave = await financialFormIns.save();
    await this.financialFormTimeService.updateStatus(
      financialFormTimeId,
      ItemStatusFinancialFormTime.Reserved,
      financialFormSave.id,
    );
    return new FinancialFormResponseDto(financialFormSave);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<FinancialFormEntity>> {
    return await paginate(
      query,
      this.financialFormRepository,
      FinancialFormPaginationConfigConst,
    );
  }

  async findAllWithUserId(
    userId: number,
    query: PaginateQuery,
  ): Promise<Paginated<FinancialFormEntity>> {
    return await paginate(query, this.financialFormRepository, {
      ...FinancialFormPaginationConfigConst,
      where: { userId },
    });
  }

  async findAllAdvisorWithUserId(query: PaginateQuery) {
    return await this.usersService.findAllAdvisor(query, { isAdvisor: true });
  }

  async findAllWithAdviserId(
    adviserId: number,
    query: PaginateQuery,
  ): Promise<Paginated<FinancialFormEntity>> {
    try {
      return await paginate(query, this.financialFormRepository, {
        ...FinancialFormPaginationConfigConst,
        where: {
          adviserId: adviserId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(fields: EntityCondition<FinancialFormEntity>) {
    const financialFormFound = await this.financialFormRepository.findOne({
      where: fields,
      relations: ['user'],
    });
    if (!financialFormFound)
      throw new NotFoundException(FinancialFormErrors.NOT_FOUND);
    return financialFormFound;
  }

  async update(id: number, updateDto: UpdateFinancialFormDto) {
    const financialFormFound = await this.financialFormRepository.findOne({
      where: { id },
    });
    if (!financialFormFound)
      throw new NotFoundException(FinancialFormErrors.NOT_FOUND);
    return await this.financialFormRepository.update(id, updateDto);
  }

  async updateStatus(id: number, updateDto: UpdateStatusFinancialFormDto) {
    console.log(updateDto);
    const financialFormFound = await this.financialFormRepository.findOne({
      where: { id, adviserId: updateDto.userId },
    });
    if (!financialFormFound)
      throw new NotFoundException(FinancialFormErrors.NOT_FOUND);
    return await this.financialFormRepository.update(id, updateDto);
  }

  async addRemoveAdvise(id: number, updateDto: UpdateFinancialFormDto) {
    const financialFormFound = await this.financialFormRepository.findOne({
      where: { id },
    });
    if (!financialFormFound)
      throw new NotFoundException(FinancialFormErrors.NOT_FOUND);
    return await this.financialFormRepository.update(id, updateDto);
  }

  async softDeleteById(id: number) {
    const financialFormFound = await this.financialFormRepository.findOne({
      where: { id },
    });
    if (!financialFormFound)
      throw new NotFoundException(FinancialFormErrors.NOT_FOUND);
    await financialFormFound.softDelete();
  }
}
