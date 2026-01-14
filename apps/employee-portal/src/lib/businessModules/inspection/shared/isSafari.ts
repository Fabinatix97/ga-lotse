/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function isSafari() {
  return (
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator?.userAgent)
  );
}
