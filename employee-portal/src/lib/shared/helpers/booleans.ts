/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

export function displayBoolean(value: boolean | undefined) {
  return isDefined(value) ? (value ? "Ja" : "Nein") : "";
}
