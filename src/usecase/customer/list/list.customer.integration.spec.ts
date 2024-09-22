import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import {InputListCustomerDto, OutputListCustomerDto} from "./list.customer.dto";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Main street", 100, "123456", "Springfield")
);

const customer2 = CustomerFactory.createWithAddress(
  "Jane Doe",
  new Address("Main street", 100, "123456", "Springfield")
);

const input: InputListCustomerDto = {};
const output: OutputListCustomerDto = {
  customers: [
    {
      id: customer1.id,
      name: customer1.name,
      address: {
        street: customer1.address.street,
        number: customer1.address.number,
        zip: customer1.address.zip,
        city: customer1.address.city,
      }
    },
    {
      id: customer2.id,
      name: customer2.name,
      address: {
        street: customer2.address.street,
        number: customer2.address.number,
        zip: customer2.address.zip,
        city: customer2.address.city,
      }
    }
  ]
};

describe('Test list customer use case integration', () => {
  let sequelize: Sequelize;
  let customerRepository: CustomerRepositoryInterface;
  let useCase: ListCustomerUseCase;

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
    await customerRepository.create(customer1);
    await customerRepository.create(customer2);
    useCase = new ListCustomerUseCase(customerRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should list customers', async () => {
    const result = await useCase.execute(input);
    expect(result).toEqual(output);
  });
})
