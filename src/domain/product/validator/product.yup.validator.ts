import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../entity/product";
import * as yup from "yup";

export default class ProductYupValidator implements ValidatorInterface<Product> {
  validate(entity: Product): void {
    try {
      const schema = yup.object().shape({
        id: yup.string().required("Id is required").typeError("Id must be a string").strict(true),
        name: yup.string().required("Name is required"),
        price: yup.number().required("Price is required").positive("Price must be greater than zero").typeError("Price must be a number"),
      }).validateSync({
        id: entity.id,
        name: entity.name,
        price: entity.price,
      }, {
        abortEarly: false
      });
    } catch (error) {
      const e = error as yup.ValidationError;
      e.errors.forEach((error) => {
        entity.notification.addError({
          message: error,
          context: "product",
        });
      });
    }
  }
}
