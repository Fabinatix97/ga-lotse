/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useControlledAlert } from "@eshg/lib-portal/errorHandling/AlertContext";

export default function DentalChildDetailsPage() {
  useControlledAlert({
    type: "error",
    open: true,
    message: "Diese Funktion steht noch nicht zur Verfügung",
  });

  return null;
}
