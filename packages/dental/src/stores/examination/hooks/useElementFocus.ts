/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useHasChanged } from "@eshg/lib-portal";

import { useExaminationStore } from "../ExaminationStoreProvider";
import { ElementContext } from "../types";

export function useElementFocus<TElement extends HTMLElement>(
  elementContext: ElementContext,
  onFocus: (element: TElement) => void = (element) => element.focus(),
) {
  const elementRef = useRef<TElement>(null);
  const isFocused = useExaminationStore(
    useShallow((state) => equalsElement(elementContext, state.currentFocus)),
  );
  const focusChanged = useHasChanged(isFocused, { changedOnInit: true });
  const setFocus = useExaminationStore((state) => state.setFocus);

  const focus = isFocused && focusChanged;
  useEffect(() => {
    if (focus && elementRef.current !== null) {
      onFocus(elementRef.current);
    }
  }, [elementRef, focus, onFocus]);

  function focusHandler(): void {
    setFocus(elementContext);
  }

  function blurHandler(): void {
    setFocus(undefined);
  }

  return { elementRef, isFocused, focusHandler, blurHandler };
}

function equalsElement(
  elementContext: ElementContext,
  currentFocus: ElementContext | undefined,
): boolean {
  if (currentFocus === undefined) {
    return false;
  }

  return (
    currentFocus.toothContext.quadrantNumber ===
      elementContext.toothContext.quadrantNumber &&
    currentFocus.toothContext.toothIndex ===
      elementContext.toothContext.toothIndex &&
    currentFocus.element === elementContext.element
  );
}
