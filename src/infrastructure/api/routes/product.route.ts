import {Router} from "express";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import {InputCreateProductDto} from "../../../usecase/product/create/create.product.dto";
import {InputListProductDto} from "../../../usecase/product/list/list.product.dto";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import FindProductUseCase from "../../../usecase/product/find/find.product.usecase";
import {InputFindProductDto} from "../../../usecase/product/find/find.product.dto";
import {InputUpdateProductDto} from "../../../usecase/product/update/update.product.dto";
import UpdateProductUseCase from "../../../usecase/product/update/update.product.usecase";

export const productRouter = Router();

productRouter.post('/', async (req, res) => {
  const useCase = new CreateProductUseCase(new ProductRepository());
  try {
    const input: InputCreateProductDto = {
      name: req.body.name,
      price: req.body.price
    };
    const output = await useCase.execute(input);
    res.status(201).json(output);
  } catch (error) {
    res.status(500).json(error);
  }
});

productRouter.get('/', async (req, res) => {
  const useCase = new ListProductUseCase(new ProductRepository());
  try {
    const input: InputListProductDto = {};
    const output = await useCase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json(error);
  }
});

productRouter.get('/:id', async (req, res) => {
  const useCase = new FindProductUseCase(new ProductRepository());
  try {
    const input: InputFindProductDto = {
      id: req.params.id
    };
    const output = await useCase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json(error);
  }
});

productRouter.patch('/:id', async (req, res) => {
  const useCase = new UpdateProductUseCase(new ProductRepository());
  try {
    const input: InputUpdateProductDto = {
      id: req.params.id,
      name: req.body.name,
      price: req.body.price
    };
    const output = await useCase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json(error);
  }
});
