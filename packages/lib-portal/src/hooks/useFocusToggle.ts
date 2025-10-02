/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";

import { useFocus } from "./useFocus";

// Used when one button should focus another button that is going to appear
// after the button has been clicked and vice versa
export function useFocusToggle(initialRef1Active: boolean) {
  const { ref: ref1, focus: focus1, reset: reset1 } = useFocus();
  const { ref: ref2, focus: focus2, reset: reset2 } = useFocus();
  const [ref1Active, setRef1Active] = useState<boolean>(initialRef1Active);

  return {
    ref1,
    ref2,
    toggle: () => {
      if (ref1Active) {
        reset1();
        focus2();
      } else {
        reset2();
        focus1();
      }

      setRef1Active((currentFocus) => !currentFocus);
    },
  };
}
