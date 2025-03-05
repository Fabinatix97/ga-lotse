/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { ElementContext } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

export function useElementFocus<TElement extends HTMLElement>(
  elementContext: ElementContext,
  onFocus: (element: TElement) => void,
) {
  const elementRef = useRef<TElement>(null);
  const isFocused = useDentalExaminationStore(
    useShallow((state) => equalsElement(elementContext, state.currentFocus)),
  );
  const focusChanged = useHasChanged(isFocused, { changedOnInit: true });
  const setFocus = useDentalExaminationStore((state) => state.setFocus);

  const focus = isFocused && focusChanged;
  useEffect(() => {
    if (focus && elementRef.current !== null) {
      onFocus(elementRef.current);
    }
  }, [elementRef, focus, onFocus]);

  function focusHandler(): void {
    setFocus(elementContext);
  }

  return { elementRef, isFocused, focusHandler };
}

function equalsElement(
  elementContext: ElementContext,
  currentFocus: ElementContext,
): boolean {
  return (
    currentFocus.toothContext.quadrantNumber ===
      elementContext.toothContext.quadrantNumber &&
    currentFocus.toothContext.toothIndex ===
      elementContext.toothContext.toothIndex &&
    currentFocus.field === elementContext.field
  );
}
