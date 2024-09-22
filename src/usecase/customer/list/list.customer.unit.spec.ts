import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Main street", 100, "123456", "Springfield")
);

const customer2 = CustomerFactory.createWithAddress(
  "Jane Doe",
  new Address("Second street", 200, "654321", "Springfield")
);

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
    update: jest.fn(),
  }
};

describe('Test list customer use case unit', () => {
  let customerRepository: CustomerRepositoryInterface;
  let useCase: ListCustomerUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    customerRepository = MockRepository();
    useCase = new ListCustomerUseCase(customerRepository);
  })

  it('should list customers', async () => {
    const output = await useCase.execute({});
    expect(customerRepository.findAll).toBeCalledTimes(1);
    expect(output).toEqual({
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
        },
      ]
    });
  });
});
