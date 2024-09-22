import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

const product1 = ProductFactory.create(
  "Product 1",
  100_00
);

const product2 = ProductFactory.create(
  "Product 2",
  200_00
);

const mockProductRepository: ProductRepositoryInterface = {
  create: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
  update: jest.fn(),
};

describe('Test list product use case unit', () => {
  let useCase: ListProductUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListProductUseCase(mockProductRepository);
  });

  it('should list products', async () => {
    const output = await useCase.execute({});
    expect(mockProductRepository.findAll).toBeCalledTimes(1);
    expect(output).toEqual({
      products: [
        {
          id: product1.id,
          name: product1.name,
          price: product1.price,
        },
        {
          id: product2.id,
          name: product2.name,
          price: product2.price,
        },
      ]
    });
  });
});
