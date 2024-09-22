import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import UpdateCustomerUseCase from "./update.customer.usecase";
import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";

const customer = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Main street", 100, "123456", "Springfield")
);

const input = {
  id: customer.id,
  name: "Jane Doe",
  address: {
    street: "Second street",
    city: "Springfield",
    number: 200,
    zip: "654321"
  }
};

describe('Test update customer use case', () => {
  let sequelize: Sequelize;
  let customerRepository: CustomerRepositoryInterface;
  let useCase: UpdateCustomerUseCase;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
    customerRepository = new CustomerRepository();
    await customerRepository.create(customer);
    useCase = new UpdateCustomerUseCase(customerRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should update a customer', async () => {
    const output = await useCase.execute(input);
    expect(output).toEqual(input);
  });
})
