import Notification from "./notification";

describe('Notification unit tests', () => {
  it('should create errors', () => {
    const notification = new Notification();
    const error = {
      message: 'Error message',
      context: 'customer'
    };
    notification.addError(error);
    expect(notification.messages("customer")).toBe("customer: Error message");

    const error2 = {
      message: 'Error message 2',
      context: 'customer'
    };
    notification.addError(error2);

    const error3 = {
      message: 'Error message',
      context: 'product'
    };
    notification.addError(error3);
    expect(notification.messages("customer")).toBe("customer: Error message, customer: Error message 2");
    expect(notification.messages("product")).toBe("product: Error message");
  });

  it('should notify errors without context', () => {
    const notification = new Notification();
    const error = {
      message: 'Error message',
      context: 'customer'
    };
    notification.addError(error);

    const error2 = {
      message: 'Error message 2',
      context: 'customer'
    };
    notification.addError(error2);

    const error3 = {
      message: 'Error message',
      context: 'product'
    };
    notification.addError(error3);
    expect(notification.messages()).toBe("customer: Error message, customer: Error message 2, product: Error message");
  });

  it('should check if notification has at least one error', () => {
    const notification = new Notification();
    expect(notification.hasErrors()).toBe(false);

    const error = {
      message: 'Error message',
      context: 'customer'
    };
    notification.addError(error);
    expect(notification.hasErrors()).toBe(true);
  });
});
