import * as React from "react"

const MOBILE_BREAKPOINT = 768 // md breakpoint in Tailwind

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      // Default to false on the server, will be corrected on client mount
      setIsMobile(false); 
      return;
    }

    const checkSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkSize();

    // Listen for resize events
    window.addEventListener("resize", checkSize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", checkSize);
  }, []) // Empty dependency array ensures this runs only once on mount and cleanup on unmount

  return isMobile; // Return the state
}