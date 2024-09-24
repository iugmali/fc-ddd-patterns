import {Router} from "express";
import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.usecase";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";
import {InputCreateCustomerDto} from "../../../usecase/customer/create/create.customer.dto";
import FindCustomerUseCase from "../../../usecase/customer/find/find.customer.usecase";
import {InputFindCustomerDto} from "../../../usecase/customer/find/find.customer.dto";
import ListCustomerUseCase from "../../../usecase/customer/list/list.customer.usecase";
import {InputListCustomerDto} from "../../../usecase/customer/list/list.customer.dto";
import UpdateCustomerUseCase from "../../../usecase/customer/update/update.customer.usecase";
import {InputUpdateCustomerDto} from "../../../usecase/customer/update/update.customer.dto";

export const customerRouter = Router();

customerRouter.post('/', async (req, res) => {
  const useCase = new CreateCustomerUseCase(new CustomerRepository());
  try {
    const input: InputCreateCustomerDto = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        number: req.body.address.number,
        zip: req.body.address.zip
      }
    }
    const output = await useCase.execute(input)
    res.status(201).json(output);
  } catch (error) {
    res.status(500).json(error);
  }
});

customerRouter.get('/', async (req, res) => {
  const useCase = new ListCustomerUseCase(new CustomerRepository());
  try {
    const input: InputListCustomerDto = {};
    const output = await useCase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json(error);
  }
});

customerRouter.get('/:id', async (req, res) => {
  const useCase = new FindCustomerUseCase(new CustomerRepository());
  try {
    const input: InputFindCustomerDto = {
      id: req.params.id
    }
    const output = await useCase.execute(input);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json(error);
  }
});

customerRouter.patch('/:id', async (req, res) => {
  const useCase = new UpdateCustomerUseCase(new CustomerRepository());
  try {
    const input: InputUpdateCustomerDto = {
      id: req.params.id,
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        number: req.body.address.number,
        zip: req.body.address.zip
      }
    }
    const output = await useCase.execute(input)
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json(error);
  }
});
