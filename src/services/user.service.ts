import { UserRepositoryInterface } from '../repositories/repository.interface';
import { CreateUserEntry, UserWithOutSensitiveInfo } from '../types/user';
import { compareSync, hashSync } from 'bcrypt';
import { badData, notFound, unauthorized } from '@hapi/boom';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { emitter } from '../event';
import { USER_EMAIL_CONFIRMATION } from '../event/mailer.event';
import { createNewJsonWithoutFields } from '../utils/general.utils';
import { User } from '@prisma/client';
import { messageDelete } from '../types/generic';

export default class UserService {
  constructor(private readonly userRepo: UserRepositoryInterface) {}

  async create(input: CreateUserEntry): Promise<UserWithOutSensitiveInfo> {
    //Check if email is already taken
    await this.isEmailAlreadyTaken(input.email);

    //Check if userName is already taken
    await this.isUserNameAlreadyTaken(input.userName);

    const user: User = await this.userRepo.create({
      ...input,
      password: hashSync(input.password!, 10),
    });

    emitter.emit(USER_EMAIL_CONFIRMATION, { email: user.email, id: user.id });

    const userWithOutSensitiveInfo = this.createUserWithOutSensitiveInfo(user);

    return userWithOutSensitiveInfo;
  }
  async findOne(id: number): Promise<UserWithOutSensitiveInfo> {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw notFound('user not found');
    }

    const userWithOutSensitiveInfo = this.createUserWithOutSensitiveInfo(user);

    return userWithOutSensitiveInfo;
  }

  async update(
    id: number,
    input: Partial<User>,
  ): Promise<UserWithOutSensitiveInfo> {
    //Check if exist the user
    await this.findOne(id);

    const { password, userName, email } = input;

    //Check if the username isn't already taken
    if (userName) {
      await this.isUserNameAlreadyTaken(userName);
    }

    //Check if the email isn't already taken
    if (email) {
      await this.isEmailAlreadyTaken(email);
    }

    const user: User = await this.userRepo.update(id, {
      ...input,
      password: password ? hashSync(password, 10) : undefined,
    });

    const userWithOutSensitiveInfo = this.createUserWithOutSensitiveInfo(user);

    return userWithOutSensitiveInfo;
  }

  async detele(id: number): Promise<object> {
    //Check if exits the unser
    await this.findOne(id);

    await this.userRepo.delete(id);

    return { message: `deleted user with id: ${id}` };
  }

  async generateConfimationToken(id: number): Promise<string> {
    const payload = { sub: id };
    const token = Jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });

    await this.update(id, { verifyToken: token });

    return token;
  }

  async confirmateAccount(token: string): Promise<messageDelete> {
    const payload: JwtPayload = Jwt.verify(
      token,
      config.jwtSecret,
    ) as JwtPayload;

    const user: User = await this.findUserWithAllInfo(+payload.sub!);

    if (user.verifyToken !== token) {
      throw unauthorized('invalid token');
    }

    if (user.isVerified) {
      throw badData('user already verified');
    }

    await this.update(user.id, {
      isVerified: true,
    });

    return { message: 'account confirmated' };
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<UserWithOutSensitiveInfo> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw unauthorized('email or password invalid');
    }

    const isPasswordMatch: boolean = compareSync(password, user.password);

    if (!isPasswordMatch) {
      throw unauthorized('email or password invalid');
    }

    const userWithOutSensitiveInfo = this.createUserWithOutSensitiveInfo(user);

    return userWithOutSensitiveInfo;
  }

  private async findByEmail(email: string): Promise<User | null> {
    const foundUser: User | null = await this.userRepo.findByEmail(email);

    return foundUser;
  }

  private createUserWithOutSensitiveInfo(user: User): UserWithOutSensitiveInfo {
    const userWithOutSensitiveInfo = createNewJsonWithoutFields<User>(user, [
      'password',
      'role',
      'createdAt',
      'updatedAt',
      'verifyToken',
      'accessToken',
      'recoveryToken',
    ]);

    if (!userWithOutSensitiveInfo.isPublicEmail) {
      delete userWithOutSensitiveInfo.email;
    }

    if (!userWithOutSensitiveInfo.isPublicName) {
      delete userWithOutSensitiveInfo.firstName;
      delete userWithOutSensitiveInfo.lastName;
    }

    return userWithOutSensitiveInfo;
  }

  private async findUserWithAllInfo(id: number): Promise<User> {
    const userWithAllInfo: User | null = await this.userRepo.findById(id);

    if (!userWithAllInfo) {
      throw notFound('user not found');
    }

    return userWithAllInfo;
  }

  private async isEmailAlreadyTaken(email: string): Promise<void> {
    const isEmailTaken = await this.userRepo.findByEmail(email);

    if (isEmailTaken) {
      throw badData('email already taken');
    }
  }

  private async isUserNameAlreadyTaken(userName: string): Promise<void> {
    const isUserNameTaken = await this.userRepo.findByUserName(userName);

    if (isUserNameTaken) {
      throw badData('username already taken');
    }
  }
}
