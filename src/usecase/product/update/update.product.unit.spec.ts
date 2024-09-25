import ProductFactory from "../../../domain/product/factory/product.factory";
import {InputUpdateProductDto} from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create(
  "Product 1",
  100_00
);

const input: InputUpdateProductDto = {
  id: product.id,
  name: 'Product 2',
  price: 200_00,
};

const MockProductRepository = () => ({
  find: jest.fn().mockReturnValue(Promise.resolve(product)),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
});

describe("test update Product use case unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a product by id", async () => {
    const productRepository = MockProductRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    const result = await useCase.execute(input);
    expect(productRepository.find).toBeCalledTimes(1);
    expect(productRepository.update).toBeCalledTimes(1);
    expect(result).toEqual(input);
  });

  it("should throw an error when product not found", async () => {
    const productRepository = MockProductRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error('Product not found');
    });
    const useCase = new UpdateProductUseCase(productRepository);
    await expect(useCase.execute(input)).rejects.toThrowError("Product not found");
  });
});
