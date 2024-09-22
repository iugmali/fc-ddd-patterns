import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import {InputCreateCustomerDto} from "./create.customer.dto";
import CreateCustomerUseCase from "./create.customer.usecase";

const input: InputCreateCustomerDto = {
  name: 'John Doe',
  address: {
    street: 'Main street',
    number: 100,
    zip: '123456',
    city: 'Springfield',
  }
};

describe('Test create customer use case integration', () => {
  let sequelize: Sequelize;
  let customerRepository: CustomerRepositoryInterface;
  let useCase: CreateCustomerUseCase;

  beforeEach(async () => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
    customerRepository = new CustomerRepository();
    useCase = new CreateCustomerUseCase(customerRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a customer', async () => {
    const output = await useCase.execute(input);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        number: input.address.number,
        zip: input.address.zip,
        city: input.address.city,
      }
    });
  });

  it('should not create a customer when name is missing', () => {
    input.name = '';
    expect(useCase.execute(input)).rejects.toThrowError("Name is required");
  });
});
