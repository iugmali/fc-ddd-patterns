import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      const order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when items array is empty", () => {
    expect(() => {
      const order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should throw error when items quantity is zero", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const item2 = new OrderItem("i2", "Item 2", 200, "p2", 0);
      const order = new Order("123", "123", [item, item2]);
    }).toThrowError("Quantity must be greater than 0");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);
    expect(order.total()).toBe(200);
    const order2 = new Order("o1", "c1", [item, item2]);
    expect(order2.total()).toBe(600);
  });

  it("should change items", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const item3 = new OrderItem("i2", "Item 2", 300, "p2", 2);
    const item4 = new OrderItem("i2", "Item 2", 150, "p2", 2);
    const order = new Order("o1", "c1", [item, item2]);
    expect(order.total()).toBe(600);
    order.changeItems([item3, item4]);
    expect(order.total()).toBe(900);
  });

  it("should throw error if the item qty is less or equal zero", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });
});
