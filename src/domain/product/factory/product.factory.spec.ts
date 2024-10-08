import ProductFactory from "./product.factory";

describe("Product factory unit test", () => {
  it("should create a product", () => {
    const product = ProductFactory.create("Product A", 1);
    expect(product.id).toBeDefined();
    expect(product.name).toBe("Product A");
    expect(product.price).toBe(1);
  });
});
