import { observer } from "mobx-react-lite";
import { Navigate } from "react-router";

import { useStores } from "../../context/StoreContext.jsx";

const ProtectedRoute = observer(function ProtectedRoute({
  children,
  requiredStatus,
  fallbackPath = "/",
}) {
  const { roomStore } = useStores();

  if (!roomStore.currentRoom || !roomStore.currentPlayer) {
    return <Navigate to="/" replace />;
  }

  if (
    requiredStatus &&
    roomStore.currentRoom.status !== requiredStatus
  ) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
});

export default ProtectedRoute;
