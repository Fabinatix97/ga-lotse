/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/inspection-api";

export function isUnknownUser(user: ApiUser) {
  return (
    user.username === "<unbekannter Benutzer>" &&
    user.firstName === "" &&
    user.lastName === ""
  );
}
