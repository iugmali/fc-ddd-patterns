import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import FindProductUseCase from "./find.product.usecase";
import {InputFindProductDto} from "./find.product.dto";

const product = ProductFactory.create(
  "Product 1",
  100_00
);

const MockProductRepository = () => ({
  find: jest.fn().mockResolvedValue(Promise.resolve(product)),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
})

const input: InputFindProductDto = {
  id: product.id
};

describe("test find Product use case unit", () => {
  let productRepository: ProductRepositoryInterface;
  let useCase: FindProductUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    productRepository = MockProductRepository();
    useCase = new FindProductUseCase(productRepository);
  });

  it("should find a product by id", async () => {
    const result = await useCase.execute(input);
    expect(result).toEqual({
      id: product.id,
      name: product.name,
      price: product.price
    });
  });

  it("should throw an error when product not found", async () => {
    productRepository.find.mockImplementation(() => {
      throw new Error('Product not found');
    });
    await expect(useCase.execute(input)).rejects.toThrowError("Product not found");
  });
});
