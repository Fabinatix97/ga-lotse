/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { vitest } from "vitest";

vitest.mock("idb", () => ({
  __esModule: true,
  openDB: () => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      put: () => {},
      get: () => ({ id: "offline-password-salt", salt: new ArrayBuffer(16) }),
    };
  },
}));
