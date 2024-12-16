import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/domains/domain-auth/users/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthProvidersEnum } from '../../../domains/domain-auth/authentications/enums/authentication-providers.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async run() {
    const superAdminId = this.configService.get('superAdmin.id');
    const email = this.configService.get('superAdmin.email');
    const phoneNumber = this.configService.get('superAdmin.phoneNumber');
    console.log('************************************');
    console.log('superAdminId');
    console.log(this.configService);
    console.log(superAdminId);
    let user = await this.userRepository.findOne({
      where: { id: superAdminId },
    });
    if (!user) {
      const password = this.configService.get('superAdmin.password');
      const salt = this.configService.get('app.hashSaltRounds');

      const encryptedPassword = await hash(password, salt);

      await this.userRepository.manager.query(`INSERT INTO public."user"
      (id, "createdAt", "updatedAt", "deletedAt", "isActive", provider, email, isAdmin, "phoneNumber", "password")
      VALUES(${superAdminId}, now(), now(), NULL, true, '${AuthProvidersEnum.email}', '${email}', true, '${phoneNumber}', '${encryptedPassword}');
      `);
      user = await this.userRepository.findOne({
        where: { id: superAdminId },
      });
    } else {
      user.email = email;
      user.isAdmin = true;
      user.password = this.configService.get('superAdmin.password');
      await user.save();
    }
  }
}
