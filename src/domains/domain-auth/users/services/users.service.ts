import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityCondition } from 'src/common/types/entity-condition.type';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserErrors } from '../enums/user-messages.enum';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User2FAType } from '../enums/user-2fa-type.enum';
import { AuthProvidersEnum } from '../../authentications/enums/authentication-providers.enum';
import { IUserExistsResult } from '../../../domain-member/user-profiles/interfaces/user-exists-result.interface';
import { generateReferralCode } from '../../../../common/helper';
import { createUserWithPhoneNumberInterface } from '../interfaces/create-user-with-phone-number.interface';
import { createUserWithEmailInterface } from '../interfaces/create-user-with-email.interface';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UserPaginationConfigConst } from '../constant/user-pagination-config.const';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  create(createProfileDto: CreateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create(createProfileDto),
    );
  }

  async createWithPhoneNumber({
    phoneNumber,
    password,
    referralUserId,
  }: createUserWithPhoneNumberInterface) {
    const referralCode = generateReferralCode();

    return await this.usersRepository.save(
      this.usersRepository.create({
        referralCode,
        referralUserId,
        password,
        phoneNumber,
        provider: AuthProvidersEnum.phoneNumber,
      }),
    );
  }

  async createWithEmail({
    email,
    password,
    referralUserId,
  }: createUserWithEmailInterface) {
    const referralCode = generateReferralCode();

    return await this.usersRepository.save(
      this.usersRepository.create({
        referralCode,
        referralUserId,
        password,
        email,
        provider: AuthProvidersEnum.email,
      }),
    );
  }

  update(id: number, userUpdateDto: UpdateUserDto) {
    return this.usersRepository.update(id, userUpdateDto);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return await paginate(
      query,
      this.usersRepository,
      UserPaginationConfigConst,
    );
  }

  async findAllAdvisor(
    query: PaginateQuery,
    field,
  ): Promise<Paginated<UserEntity>> {
    return await paginate(query, this.usersRepository, {
      ...UserPaginationConfigConst,
      where: field,
    });
  }

  async updateAdvisor(
    query: PaginateQuery,
    field,
  ): Promise<Paginated<UserEntity>> {
    return await paginate(query, this.usersRepository, {
      ...UserPaginationConfigConst,
      where: field,
    });
  }

  async findByPhoneNumberAndActiveWithProfile(
    phoneNumber: string,
    required = false,
  ) {
    const userFound = await this.usersRepository.findOne({
      where: { phoneNumber },
      relations: ['profile'],
    });

    this.validateUserFound(userFound, required);

    return userFound;
  }

  async findByEmailAndActiveWithProfile(email: string, required = false) {
    const userFound = await this.usersRepository.findOne({
      where: { email },
      relations: ['profile'],
    });

    this.validateUserFound(userFound, required);

    return userFound;
  }

  async findOne(fields: EntityCondition<UserEntity>, required = false) {
    const userFound = await this.usersRepository.findOne({
      where: fields,
    });

    this.validateUserFound(userFound, required);

    return userFound;
  }

  async findByIdAndActive(id: number, required = false) {
    const userFound = await this.usersRepository.findOne({
      where: { id },
      relations: { profile: true },
    });

    this.validateUserFound(userFound, required);

    return userFound;
  }

  async findByIds(ids: number[]) {
    return await this.usersRepository.find({
      where: { id: In(ids) },
    });
  }

  async findByIdForAuth(id: number, required = false) {
    const userFound = await this.usersRepository.findOne({
      where: { id, isActive: true },
    });

    this.validateUserFound(userFound, required);

    return userFound;
  }

  async findByPhoneNumberAndActive(phoneNumber: string, required = false) {
    const userFound = await this.usersRepository.findOne({
      where: { phoneNumber },
      relations: { profile: true },
    });

    this.validateUserFound(userFound, required);

    return userFound;
  }

  async findByEmailAndActive(email: string, required = false) {
    const userFound = await this.usersRepository.findOne({
      where: { email },
      relations: { profile: true },
    });

    this.validateUserFound(userFound, required);
    return userFound;
  }

  private validateUserFound(userFound: UserEntity, required: boolean) {
    if (!userFound && required)
      throw new NotFoundException(UserErrors.NOT_FOUND);
    if (userFound && !userFound.isActive)
      throw new ForbiddenException(UserErrors.IS_NOT_ACTIVE);
  }

  async setTWOFactorAuthentication(
    twoFAType: User2FAType,
    userId: number,
    twoFASecret?: string,
  ) {
    const userFound = await this.usersRepository.findOneBy({ id: userId });

    if (
      twoFAType === User2FAType.PHONE_NUMBER &&
      !userFound &&
      !userFound.phoneNumber
    )
      throw new ForbiddenException(UserErrors.PHONE_NUMBER_NOT_SET_YET);
    if (twoFAType === User2FAType.EMAIL && !userFound && !userFound.email)
      throw new ForbiddenException(UserErrors.EMAIL_NOT_SET_YET);

    return await this.usersRepository.update(
      { id: userId },
      { twoFAType, twoFASecret },
    );
  }

  async isExistsByEmail(email: string): Promise<IUserExistsResult> {
    const userFound = await this.usersRepository.findOne({
      where: { email },
      select: ['id'],
      relations: ['profile'],
    });
    if (!userFound) return { isExists: false, isInitialized: false };
    if (!userFound.profile) return { isExists: true, isInitialized: false };
    return { isExists: true, isInitialized: true };
  }

  async isExistsByPhoneNumber(phoneNumber: string): Promise<IUserExistsResult> {
    const userFound = await this.usersRepository.findOne({
      where: { phoneNumber },
      select: ['id'],
      relations: ['profile'],
    });
    if (!userFound) return { isExists: false, isInitialized: false };
    if (!userFound.profile) return { isExists: true, isInitialized: false };
    return { isExists: true, isInitialized: true };
  }

  async softDeleteById(id: number) {
    const userFound = await this.usersRepository.findOne({
      where: { id },
    });
    if (!userFound) throw new NotFoundException(UserErrors.NOT_FOUND);
    return await this.usersRepository.softDelete(id);
  }
}
