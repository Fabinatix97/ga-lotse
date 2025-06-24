/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { KeyboardEvent, KeyboardEventHandler } from "react";

import { useExaminationStore } from "../ExaminationStoreProvider";
import { NavigateDirection } from "../actions/navigateFrom";

const NAVIGATE_DIRECTIONS = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
} satisfies Record<string, NavigateDirection>;

type KeyboardEventTarget = HTMLInputElement | HTMLButtonElement;

export function useKeyboardNavigationHandler(): KeyboardEventHandler<KeyboardEventTarget> {
  const navigateFrom = useExaminationStore((state) => state.navigateFrom);

  return function handleEvent(event: KeyboardEvent<KeyboardEventTarget>): void {
    if (!isKeyboardNavigationEvent(event.code)) {
      return;
    }

    const direction = NAVIGATE_DIRECTIONS[event.code];
    navigateFrom(direction);
    event.preventDefault();
  };
}

export function isKeyboardNavigationEvent(
  eventCode: string,
): eventCode is keyof typeof NAVIGATE_DIRECTIONS {
  return eventCode in NAVIGATE_DIRECTIONS;
}
