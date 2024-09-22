import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";
import Customer from "../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";

describe('Test find customer use case', () => {
  let sequelize: Sequelize;
  let customerRepository: CustomerRepositoryInterface;
  let customer: Customer;
  let useCase: FindCustomerUseCase;

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
    customer = CustomerFactory.createWithAddress(
      'John Doe',
      new Address(
        'Main street',
        100,
        '123456',
        'Springfield',
      ));
    await customerRepository.create(customer);
    useCase = new FindCustomerUseCase(customerRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should find a customer', async () => {
    const input = { id: customer.id };
    const output = {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.address.street,
        city: customer.address.city,
        number: customer.address.number,
        zip: customer.address.zip,
      },
    };
    const result = await useCase.execute(input);
    expect(result).toEqual(output);
  });

  it('should not find a customer', () => {
    const input = { id: "abc" };
    expect(useCase.execute(input)).rejects.toThrowError("Customer not found");
  });
});
