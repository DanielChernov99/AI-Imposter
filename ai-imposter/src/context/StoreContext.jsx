import { createContext, useContext } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ store, children }) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useStores() {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("useStores must be used inside StoreProvider");
  }

  return store;
}
