import { UserRepositoryInterface } from '../repositories/repository.interface';
import { CreateUserEntry, UserWithOutSensitiveInfo } from '../types/user';
import { hashSync } from 'bcrypt';
import { badData } from '@hapi/boom';

export default class UserService {
  constructor(private readonly userRepo: UserRepositoryInterface) {}
  async create(input: CreateUserEntry) {
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

    delete user.password;
    delete user.updatedAt;
    delete user.createdAt;

    return user;
  }
}
