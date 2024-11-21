/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useControlledAlert } from "@eshg/lib-portal/errorHandling/AlertContext";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function DentalProceduresPage() {
  useControlledAlert({
    type: "error",
    open: true,
    message: "Diese Funktion steht noch nicht zur Verfügung",
  });

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Zahnärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight></MainContentLayout>
    </StickyToolbarLayout>
  );
}
