import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProfileNotFound } from '../profile.exception';
import { ICreateProfile } from '../interfaces/create-profile.interface';
import { UserProfile } from '../entities/profile.entity';
import { SharedErrors } from 'src/common/enums/shared-messages.enum';
import { UserSessionsService } from 'src/domains/domain-auth/modules/user-sessions/services/user-sessions.service';
import { initializeProfileTtl } from '../constants/initialize-profile-ttl.constant';
import { ProfileDto } from '../dto/profile.dto';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UserEntity } from 'src/domains/domain-auth/users/entities/user.entity';
import { ZonesService } from 'src/domains/domain-public/zones/zones.service';
import { UsersProfileMessagesEnum } from '../enums/users-profile-messages.enum';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    private userSessionsService: UserSessionsService,
    private zoneService: ZonesService,
  ) {}

  async initializeProfile(
    user: UserEntity,
    userAgents: string,
    createProfileDto: CreateProfileDto,
  ) {
    const thisSession =
      await this.userSessionsService.findOneByUserAgentAndUserId(
        user.id,
        userAgents,
      );

    if (thisSession.loggedInAt < new Date(Date.now() - initializeProfileTtl)) {
      throw new ForbiddenException(
        UsersProfileMessagesEnum.INITIALIZE_TIME_EXPIRED,
      );
    }

    const profileFound = await this.findByUserId(user.id);
    if (profileFound)
      throw new ConflictException(UsersProfileMessagesEnum.CREATED_BEFORE);

    const profileInstance = await this.create({
      ...createProfileDto,
      userId: user.id,
    });
    return new ProfileDto(profileInstance);
  }

  async create(createProfileDto: ICreateProfile): Promise<UserProfile> {
    return await this.profileRepository.save(
      this.profileRepository.create(createProfileDto),
    );
  }

  async findMany({ fullName, phoneNumber, page, limit }) {
    const [data, count] = await this.profileRepository
      .createQueryBuilder('profile')
      .where(
        `CONCAT(LOWER(profile.firstName), ' ', LOWER(profile.lastName)) LIKE :fullName`,
        {
          fullName: `%${fullName.toLowerCase()}%`,
        },
      )
      .innerJoin('profile.user', 'user', 'user.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${phoneNumber || ''}%`,
      })
      .leftJoinAndSelect('profile.customer', 'customer')
      .addSelect('user.id')
      .addSelect('user.phoneNumber')
      .addSelect('user.email')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, count };
  }

  async findByUserId(userId: number, required = false) {
    const profileFound = await this.profileRepository.findOne({
      where: { userId },
    });
    if (required && !profileFound) throw new ProfileNotFound();

    return profileFound;
  }

  async findByUserIdWithUser(userId: number, required = false) {
    const profileFound = await this.profileRepository.findOne({
      relations: ['user'],
      where: { userId },
    });
    if (required && !profileFound) throw new ProfileNotFound();

    profileFound?.cityId &&
      (profileFound['zone'] = await this.zoneService.getCity(
        profileFound.cityId,
      ));

    return new ProfileDto(profileFound);
  }

  async findByIds(ids: number[]): Promise<UserProfile[]> {
    const profilesFound = await this.profileRepository.find({
      where: { id: In(ids) },
    });
    if (profilesFound.length !== ids.length)
      throw new NotFoundException(UsersProfileMessagesEnum.LIST_NOT_FOUND);
    return profilesFound;
  }

  async updateByUserId(userId: number, updateProfileDto: UpdateProfileDto) {
    const profileFound = await this.profileRepository.update(
      { userId },
      updateProfileDto,
    );
    if (!profileFound.affected)
      throw new ServiceUnavailableException(SharedErrors.UPDATE_FAILED);
  }

  async findOne(id: number): Promise<UserProfile> {
    const profileFound = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profileFound)
      throw new NotFoundException(UsersProfileMessagesEnum.NOT_FOUND);
    return profileFound;
  }

  async findOneWithUser(id: number) {
    const profileFound = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        user: {
          id: true,
          phoneNumber: true,
          email: true,
        },
      },
    });
    return profileFound;
  }
}
