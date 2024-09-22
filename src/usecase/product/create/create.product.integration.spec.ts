import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import CreateProductUseCase from "./create.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {InputCreateProductDto} from "./create.product.dto";
import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

const input: InputCreateProductDto = {
  name: 'Product 1',
  price: 100_00,
};


describe('Test create product use case integration', () => {
  let sequelize: Sequelize;
  let productRepository: ProductRepositoryInterface;
  let useCase: CreateProductUseCase;

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
    useCase = new CreateProductUseCase(productRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const result = await useCase.execute(input);
    expect(result).toEqual({
      id: expect.any(String),
      name: 'Product 1',
      price: 100_00,
    });
  });

  it('should throw an error when product already exists', async () => {
    const productCreated = await useCase.execute(input);
    await expect(useCase.execute(input)).rejects.toThrowError("Validation error");
  });
})
