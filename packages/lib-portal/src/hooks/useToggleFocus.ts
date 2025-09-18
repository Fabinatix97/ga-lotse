/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

// Used when one button should focus another button that is going to appear
// after the button has been clicked and vice versa
export function useToggleFocus(initialRef1Active: boolean) {
  const [ref1Focused, setRef1Focused] = useState<boolean>(false);
  const [ref2Focused, setRef2Focused] = useState<boolean>(false);
  const [ref1Active, setRef1Active] = useState<boolean>(initialRef1Active);
  const ref1 = useRef<HTMLElement>(null);
  const ref2 = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref1Focused && ref1.current) {
      ref2.current = null;
      ref1.current.focus();
      setRef1Focused(false);
    }
  }, [ref1Focused]);

  useEffect(() => {
    if (ref2Focused && ref2.current) {
      ref1.current = null;
      ref2.current.focus();
      setRef2Focused(false);
    }
  }, [ref2Focused]);

  return {
    ref1,
    ref2,
    toggle: () => {
      if (ref1Active) {
        setRef2Focused(true);
      } else {
        setRef1Focused(true);
      }

      setRef1Active((currentFocus) => !currentFocus);
    },
  };
}
