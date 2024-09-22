import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {InputListProductDto, OutputListProductDto} from "./list.product.dto";
import Product from "../../../domain/product/entity/product";

export default class ListProductUseCase {
  constructor(private productRepository: ProductRepositoryInterface) {}

  async execute(input: InputListProductDto): Promise<OutputListProductDto> {
    const products = await this.productRepository.findAll();
    return OutputMapper.toDto(products);
  }
}

export class OutputMapper {
  static toDto(products: Product[]): OutputListProductDto {
    return {
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
      }))
    }
  }
}
