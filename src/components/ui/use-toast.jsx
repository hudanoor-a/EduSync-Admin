"use client"; // Make this a client component as it uses React Context and state
import * as React from "react";
// Assuming toast and reducer are needed here from toastUtils.js
// However, the original use-toast.ts (utils.ts) provided `toast` function and `reducer`.
// The current `use-toast.jsx` is simpler and likely expects `toast` to be available globally or passed differently.
// For now, let's keep the simple context provider structure from the original file.
// The `toast` function and `reducer` would typically be part of this context's value or logic.
// For this iteration, we'll keep it as a simple context provider as originally scaffolded.
// The actual toast creation logic is in `src/lib/toastUtils.js`.
// This component's role is to provide the `toasts` array and a way to `add/update/dismiss` them.

// This component needs to manage the state using the reducer from toastUtils.js
import { reducer, toast as createToastFunction, actionTypes } from "@/lib/toastUtils.js";


const ToastContext = React.createContext(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const toast = React.useCallback((props) => {
    return createToastFunction({ ...props, dispatch });
  }, []);
  
  // Helper function to dispatch actions
  const addToast = React.useCallback((newToastData) => {
    const id = Date.now().toString(); // Simple ID generation
    dispatch({
      type: actionTypes.ADD_TOAST,
      toast: { ...newToastData, id, open: true, onOpenChange: (open) => !open && dismissToast(id) },
    });
    return id;
  }, [dispatch]);

  const updateToast = React.useCallback((toastToUpdate) => {
     dispatch({ type: actionTypes.UPDATE_TOAST, toast: toastToUpdate });
  }, [dispatch]);

  const dismissToast = React.useCallback((toastId) => {
     dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
  }, [dispatch]);


  const value = React.useMemo(() => ({
    toasts: state.toasts,
    toast, // The function to create a toast
    // For direct manipulation if needed, though `toast()` function handles this.
    addToast, 
    updateToast,
    dismissToast,
  }), [state.toasts, toast, addToast, updateToast, dismissToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
