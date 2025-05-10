import * as React from "react";

const ToastContext = React.createContext({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
});

const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (toast) => {
    setToasts((prev) => [...prev, toast]);
  };

  const updateToast = (toast) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === toast.id ? { ...t, ...toast } : t))
    );
  };

  const dismissToast = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  const value = {
    toasts,
    addToast,
    updateToast,
    dismissToast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export { ToastProvider, useToast };