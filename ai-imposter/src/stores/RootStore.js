import RoomStore from "./RoomStore.js";

export default class RootStore {
  constructor({ roomService }) {
    this.roomStore = new RoomStore(roomService);
  }
}
