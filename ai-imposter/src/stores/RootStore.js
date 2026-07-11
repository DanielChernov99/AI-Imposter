import createMockRoomService from "../services/mockRoomService.js";
import RoomStore from "./RoomStore.js";

export default class RootStore {
  constructor() {
    const roomService = createMockRoomService();

    this.roomStore = new RoomStore(roomService);
  }
}
