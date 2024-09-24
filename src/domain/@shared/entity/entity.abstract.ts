import Notification from "../notification/notification";

export default abstract class Entity {
  protected readonly _id: string;
  protected notification: Notification;

  protected constructor(id: string) {
    this._id = id;
    this.notification = new Notification();
  }

  get id(): string {
    return this._id;
  }
}
