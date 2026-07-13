import { observer } from "mobx-react-lite";
import { Navigate } from "react-router";

import { useStores } from "../../context/StoreContext.jsx";
import { ROOM_STATUS } from "../../domain/constants.js";

/**
 * Guards a route by room status.
 *
 * - No room/player -> back to the start page.
 * - Room finished -> the result page, always (checked before allowedStatuses
 *   so /lobby and /game can't bounce a finished room between each other).
 * - Status not in allowedStatuses -> fallbackPath.
 *
 * Because this is an observer, Realtime room-status changes re-evaluate the
 * guard automatically — this is what moves everyone from the lobby to the
 * game when the countdown ends, with no manual navigate() calls.
 */
const ProtectedRoute = observer(function ProtectedRoute({
  children,
  allowedStatuses,
  fallbackPath = "/",
}) {
  const { roomStore } = useStores();

  if (!roomStore.currentRoom || !roomStore.currentPlayer) {
    return <Navigate to="/" replace />;
  }

  const { status } = roomStore.currentRoom;

  if (status === ROOM_STATUS.FINISHED) {
    return <Navigate to="/result" replace />;
  }

  if (allowedStatuses && !allowedStatuses.includes(status)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
});

export default ProtectedRoute;
