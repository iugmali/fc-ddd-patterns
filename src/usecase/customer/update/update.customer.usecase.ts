import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import {InputUpdateCustomerDto, OutputUpdateCustomerDto} from "./update.customer.dto";
import Address from "../../../domain/customer/value-object/address";

export default class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(input: InputUpdateCustomerDto): Promise<OutputUpdateCustomerDto> {
    const customer = await this.customerRepository.find(input.id);
    customer.changeName(input.name);
    const address = new Address(input.address.street, input.address.number, input.address.zip, input.address.city);
    customer.changeAddress(address);


    await this.customerRepository.update(customer);

    return {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.Address.street,
        number: customer.Address.number,
        zip: customer.Address.zip,
        city: customer.Address.city,
      }
    };
  }
}
