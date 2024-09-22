import {InputCreateProductDto} from "./create.product.dto";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import FindProductUseCase from "../find/find.product.usecase";
import CreateProductUseCase from "./create.product.usecase";

const input: InputCreateProductDto = {
  name: "Product 1",
  price: 100_00
}

const MockProductRepository = () => ({
  find: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
})

describe('Test create product use case unit', () => {
  let productRepository: ProductRepositoryInterface;
  let useCase: CreateProductUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    productRepository = MockProductRepository();
    useCase = new CreateProductUseCase(productRepository);
  });

  it('should create a product', async () => {
    const output = await useCase.execute(input);
    expect(productRepository.create).toBeCalledTimes(1);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price
    });
  });

})
