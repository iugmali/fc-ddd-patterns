import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import UpdateCustomerUseCase from "./update.customer.usecase";

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

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    update: jest.fn(),
  }
}

let customerRepository: CustomerRepositoryInterface;
let useCase: UpdateCustomerUseCase;

describe('Test update customer use case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    customerRepository = MockRepository();
    useCase = new UpdateCustomerUseCase(customerRepository);
  })

  it('should update a customer', async () => {
    const output = await useCase.execute(input);
    expect(customerRepository.find).toBeCalledTimes(1);
    expect(customerRepository.update).toBeCalledTimes(1);
    expect(output).toEqual(input);
  });
})
