import { useState } from 'react';

export function useSidebarState(initialExpanded = true) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggle = () => setIsExpanded((prev) => !prev);

  return { isExpanded, toggle };
}
