"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavigationHandler() {
  const router = useRouter();

  useEffect(() => {
    // This event fires when the page is loaded, including from the back/forward cache
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // If the page was loaded from the cache (e.g., via the back button), 
        // force a refresh to ensure everything is initialized correctly
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return null;
}
