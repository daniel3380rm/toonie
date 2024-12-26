import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Raw, Repository } from 'typeorm';
import { CreateFinancialFormTimeDto } from '../dto/create-financial-form-time.dto';
import { FinancialFormTimeEntity } from '../entities/financial-form-time.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { FinancialFormTimePaginationConfigConst } from '../constant/financial-form-time-pagination-config.const';
import { FinancialFormTimeErrors } from '../enums/financial-form-time-messages.enum';
import { EntityCondition } from 'src/common/types/entity-condition.type';

@Injectable()
export class FinancialFormTimeService {
  constructor(
    @InjectRepository(FinancialFormTimeEntity)
    private readonly financialFormTimeRepository: Repository<FinancialFormTimeEntity>,
  ) {}

  async create(createDto: CreateFinancialFormTimeDto) {
    const { day, startTime, endTime, userId } = createDto;
    const obj = this.createTimeSlots(startTime, endTime, 30);
    const isSlotAvailable = await this.findOneExist(userId, day);
    if (isSlotAvailable) {
      throw new NotFoundException(FinancialFormTimeErrors.NOT_ACCEPTABLE_TIME);
    }
    const promises = obj.map(async (item) => {
      const dateTimeString = day + ' ' + item;
      const dateTime = new Date(dateTimeString);
      await this.financialFormTimeRepository.save({
        userId,
        time: dateTime,
      });
    });
    await Promise.all(promises);
    return {
      day,
      startTime,
      endTime,
    };
  }

  async findAllWithUserId(
    userId: number,
    query: PaginateQuery,
  ): Promise<Paginated<FinancialFormTimeEntity>> {
    return await paginate(query, this.financialFormTimeRepository, {
      ...FinancialFormTimePaginationConfigConst,
      where: {
        id: In(
          await this.financialFormTimeRepository
            .createQueryBuilder('ft')
            .select('MIN(ft.id)', 'id')
            .groupBy('ft.time')
            .getRawMany()
            .then((results) => results.map((r) => r.id)),
        ),
        financialFormId: IsNull(),
      },
    });
  }

  async findOne(fields: EntityCondition<FinancialFormTimeEntity>) {
    const financialFormFound = await this.financialFormTimeRepository.findOne({
      where: fields,
    });
    if (!financialFormFound)
      throw new NotFoundException(FinancialFormTimeErrors.NOT_FOUND);
    return financialFormFound;
  }

  async updateStatus(id: number, status: number, financialFormId: number) {
    const financialFormFound = await this.financialFormTimeRepository.update(
      id,
      { status, financialFormId },
    );
    return financialFormFound;
  }

  async findOneExist(userId: number, dateTime: Date) {
    const existingTurn = await this.financialFormTimeRepository
      .createQueryBuilder('financialForm')
      .where('financialForm.userId = :userId', { userId })
      .andWhere(
        "TO_CHAR(financialForm.time, 'YYYY-MM-DD HH24:MI:SS') LIKE :dateTime",
        {
          dateTime: `%${dateTime}%`,
        },
      )
      .getOne();

    return existingTurn;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }

  private createTimeSlots(startTimeAm, endTimePm, timeDuration) {
    const timeSlots = [];
    const startTime = this.timeToMinutes(startTimeAm);
    const endTime = this.timeToMinutes(endTimePm);
    for (let time = startTime; time < endTime; time += timeDuration) {
      const startSlot = this.minutesToTime(time);
      timeSlots.push(`${startSlot}`);
    }

    return timeSlots;
  }
}
