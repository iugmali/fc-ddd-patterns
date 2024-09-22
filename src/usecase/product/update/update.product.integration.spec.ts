import UpdateProductUseCase from "./update.product.usecase";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductFactory from "../../../domain/product/factory/product.factory";
import {InputUpdateProductDto} from "./update.product.dto";

const product = ProductFactory.create(
  "Product 1",
  100_00
);

const product2 = ProductFactory.create(
  "Product 2",
  200_00
);

const input: InputUpdateProductDto = {
  id: product.id,
  name: 'Product 3',
  price: 200_00,
};

describe("test update Product use case integration", () => {
  let sequelize: Sequelize;
  let productRepository: ProductRepositoryInterface;
  let useCase: UpdateProductUseCase;

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
    await productRepository.create(product2);
    useCase = new UpdateProductUseCase(productRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product by id", async () => {
    const result = await useCase.execute(input);
    expect(result).toEqual(input);
  });

  it("should throw an error if the product already exists", async () => {
    input.name = "Product 2";
    expect(useCase.execute(input)).rejects.toThrowError();
  });

  it("should throw an error when product not found", async () => {
    input.id = "invalid-id";
    await expect(useCase.execute(input)).rejects.toThrowError("Product not found");
  });

  it("should throw an error when product name is empty", async () => {
    input.id = product.id;
    input.name = "";
    await expect(useCase.execute(input)).rejects.toThrowError("Name is required");
  });
});
