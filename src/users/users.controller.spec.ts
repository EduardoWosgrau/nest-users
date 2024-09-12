import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

const mockUserData = [
  {
    id: '1',
    name: 'Eduardo Wosgrau',
    email: 'eduardo.wosgrau@gmail.com',
    birthDate: new Date(),
  },
];

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUserModel = {
    find: jest.fn().mockResolvedValue(mockUserData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUserData);

      expect(await usersController.findAll()).toBe(mockUserData);
    });
  });
});
