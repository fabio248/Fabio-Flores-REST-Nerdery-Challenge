import { UserRepositoryInterface } from '../repositories/repository.interface';
import {
  CreateUserEntry,
  UserEntry,
  UserWithOutSensitiveInfo,
} from '../types/user';
import { hashSync } from 'bcrypt';
import { badData, notFound, unauthorized } from '@hapi/boom';
import Jwt from 'jsonwebtoken';
import config from '../config';
import { emitter } from '../event';
import { USER_EMAIL_CONFIRMATION } from '../event/mailer.event';

export default class UserService {
  constructor(private readonly userRepo: UserRepositoryInterface) {}

  async create(input: CreateUserEntry): Promise<UserWithOutSensitiveInfo> {
    const isEmailTaken = await this.userRepo.findByEmail(input.email);

    if (isEmailTaken) {
      throw badData('Email already taken');
    }

    const isUserNameTaken = await this.userRepo.findByUserName(input.userName);

    if (isUserNameTaken) {
      throw badData('Username already taken');
    }

    const user: UserWithOutSensitiveInfo = await this.userRepo.create({
      ...input,
      password: hashSync(input.password!, 10),
    });

    emitter.emit(USER_EMAIL_CONFIRMATION, { email: user.email, id: user.id });

    delete user.password;
    delete user.updatedAt;
    delete user.createdAt;

    return user;
  }
  async findOne(id: number): Promise<UserWithOutSensitiveInfo> {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw notFound('User not found');
    }

    return user;
  }

  async update(
    id: number,
    input: Partial<UserEntry>,
  ): Promise<UserWithOutSensitiveInfo> {
    const { password } = input;
    const userUpdated: UserWithOutSensitiveInfo = await this.userRepo.update(
      id,
      {
        ...input,
        password: password ? hashSync(password, 10) : undefined,
      },
    );

    delete userUpdated.password;
    delete userUpdated.updatedAt;
    delete userUpdated.createdAt;

    return userUpdated;
  }

  async generateConfimationToken(id: number): Promise<string> {
    const payload = { sub: id };
    const token = Jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    await this.update(id, { verifyToken: token });
    return token;
  }

  async confirmateAccount(token: string): Promise<{ message: string }> {
    const payload = Jwt.verify(token, config.jwtSecret);

    const user: UserWithOutSensitiveInfo = await this.findOne(+payload.sub!);

    if (user.verifyToken !== token) {
      throw unauthorized('Invalid Token');
    }

    if (user.isVerified) {
      throw badData('User already verified');
    }

    await this.update(user.id, {
      isVerified: true,
    });

    return { message: 'Account confirmated' };
  }
}
