/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import type { de } from "./de";

export const en = {
  validation: {
    email: "Please enter a valid email address.",
    length:
      "Text must be between {{startInclusive}} and {{endInclusive}} symbols long.",
    pastOrTodayDate: "The date lies in the future.",
  },
} satisfies typeof de;
