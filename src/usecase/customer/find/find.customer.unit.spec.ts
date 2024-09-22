import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";
import Customer from "../../../domain/customer/entity/customer";

const customer = CustomerFactory.createWithAddress(
  'John Doe',
  new Address(
    'Main street',
    100,
    '123456',
    'Springfield',
  ));


const MockCustomerRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    update: jest.fn(),
  }
};

describe('Test find customer use case', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should find a customer', async () => {
    const customerRepository = MockCustomerRepository();
    const usecase = new FindCustomerUseCase(customerRepository);
    const input = { id: customer.id };
    const output = {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.Address.street,
        city: customer.Address.city,
        number: customer.Address.number,
        zip: customer.Address.zip,
      },
    };
    const result = await usecase.execute(input);
    expect(result).toEqual(output);
  });

  it('should not find a customer', () => {
    const customerRepository = MockCustomerRepository();
    customerRepository.find.mockImplementation(() => {
      throw new Error('Customer not found');
    });
    const usecase = new FindCustomerUseCase(customerRepository);
    const input = { id: "123"};
    expect(usecase.execute(input)).rejects.toThrowError('Customer not found');
  });
});
