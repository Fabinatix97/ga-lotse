/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { notFound } from "next/navigation";
import { useEffect } from "react";

export function ChatFeatureUnavailable() {
  useEffect(() => {
    notFound();
  }, []);

  return null;
}
