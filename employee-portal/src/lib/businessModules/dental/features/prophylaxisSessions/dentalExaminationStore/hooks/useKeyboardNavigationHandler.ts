/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { KeyboardEvent, KeyboardEventHandler } from "react";
import { isDefined } from "remeda";

import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { NAVIGATE_DIRECTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/constants";

type KeyboardEventTarget = HTMLInputElement | HTMLButtonElement;

export function useKeyboardNavigationHandler(): KeyboardEventHandler<KeyboardEventTarget> {
  const navigate = useDentalExaminationStore((state) => state.navigate);

  return function handleEvent(event: KeyboardEvent<KeyboardEventTarget>): void {
    const direction = NAVIGATE_DIRECTIONS[event.code];

    if (isDefined(direction)) {
      navigate(direction);
      event.preventDefault();
    }
  };
}
