import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerFactory from "../factory/customer.factory";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";
import Address from "../value-object/address";
import {CustomerAddressChangedEvent} from "./customer-address-changed.event";

describe("Customer address changed event tests", () => {
  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers.CustomerAddressChangedEvent[0]
    ).toMatchObject(eventHandler);

    const address = new Address("Street", 1, "13330-250", "São Paulo");
    const newCustomer = CustomerFactory.createWithAddress("John", address);

    const customerAddressChangedEvent = new CustomerAddressChangedEvent(newCustomer);

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
