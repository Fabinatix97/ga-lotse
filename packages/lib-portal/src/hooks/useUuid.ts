/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useUuid(): string {
  const [uuid] = useState(() => uuidv4());
  return uuid;
}
