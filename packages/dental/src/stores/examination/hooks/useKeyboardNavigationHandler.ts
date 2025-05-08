/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { KeyboardEvent, KeyboardEventHandler } from "react";
import { isDefined } from "remeda";

import { useExaminationStore } from "../ExaminationStoreProvider";
import { NavigateDirection } from "../actions/navigateFrom";

const NAVIGATE_DIRECTIONS: Record<string, NavigateDirection> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
};

type KeyboardEventTarget = HTMLInputElement | HTMLButtonElement;

export function useKeyboardNavigationHandler(): KeyboardEventHandler<KeyboardEventTarget> {
  const navigateFrom = useExaminationStore((state) => state.navigateFrom);

  return function handleEvent(event: KeyboardEvent<KeyboardEventTarget>): void {
    const direction = NAVIGATE_DIRECTIONS[event.code];

    if (isDefined(direction)) {
      navigateFrom(direction);
      event.preventDefault();
    }
  };
}
