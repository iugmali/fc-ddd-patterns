import CreateCustomerUseCase from "./create.customer.usecase";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";

const input = {
  name: "John Doe",
  address: {
    street: "Main street",
    city: "Springfield",
    number: 100,
    zip: "123456"
  }
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  }
}

let customerRepository: CustomerRepositoryInterface;
let usecase: CreateCustomerUseCase;

describe('Test create customer use case unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    customerRepository = MockRepository();
    usecase = new CreateCustomerUseCase(customerRepository);
  })


  it('should create a customer', async () => {
    const output = await usecase.execute(input);
    expect(customerRepository.create).toBeCalledTimes(1);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: input.address,
    });
  });

  it('should throw an error when name is missing', () => {
    input.name = "";
    expect(usecase.execute(input)).rejects.toThrowError('Name is required');
  });

  it('should throw an error when address street is missing', () => {
    input.address.street = "";
    expect(usecase.execute(input)).rejects.toThrowError('Street is required');
  });
});
