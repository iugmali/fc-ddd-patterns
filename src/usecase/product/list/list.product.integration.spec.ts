import ProductFactory from "../../../domain/product/factory/product.factory";
import {Sequelize} from "sequelize-typescript";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import UpdateProductUseCase from "../update/update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

const product1 = ProductFactory.create(
  "Product 1",
  100_00
);

const product2 = ProductFactory.create(
  "Product 2",
  200_00
);

describe('Test list product use case integration', () => {
  let sequelize: Sequelize;
  let productRepository: ProductRepositoryInterface;
  let useCase: ListProductUseCase;

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
    await productRepository.create(product1);
    await productRepository.create(product2);
    useCase = new ListProductUseCase(productRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should list products', async () => {
    const output = await useCase.execute({});
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
