import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler";
import CustomerFactory from "../factory/customer.factory";
import {CustomerCreatedEvent} from "./customer-created.event";

describe("Customer created event tests", () => {
  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]
    ).toMatchObject(eventHandler2);

    const newCustomer = CustomerFactory.create("John Doe");
    const customerCreatedEvent = new CustomerCreatedEvent(newCustomer);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
