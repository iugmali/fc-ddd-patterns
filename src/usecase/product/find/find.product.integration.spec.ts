import {Sequelize} from "sequelize-typescript";
import FindProductUseCase from "./find.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import {InputFindProductDto} from "./find.product.dto";

const product = ProductFactory.create(
  "Product 1",
  100_00
);

const input: InputFindProductDto = {
  id: product.id
};

describe('Test find product use case integration', () => {
  let sequelize: Sequelize;
  let productRepository: ProductRepositoryInterface;
  let useCase: FindProductUseCase;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();
    productRepository = new ProductRepository();
    await productRepository.create(product);
    useCase = new FindProductUseCase(productRepository);
  });

  afterEach(async () => {
    await sequelize.close();
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
    input.id = "b";
    await expect(useCase.execute(input)).rejects.toThrowError("Product not found");
  });

})
