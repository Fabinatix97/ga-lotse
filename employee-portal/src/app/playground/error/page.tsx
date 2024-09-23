/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export default function RuntimeErrorPage() {
  throw new Error("Runtime error which should not be visible in the browser");
}
