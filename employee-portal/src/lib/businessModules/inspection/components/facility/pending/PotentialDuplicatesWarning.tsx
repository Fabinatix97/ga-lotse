/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Alert } from "@eshg/lib-portal/components/Alert";

import { formatPossibleDuplicates } from "@/lib/businessModules/inspection/components/processImport/formatters";

export interface PotentialDuplicatesWarningProps {
  numberOfDuplicates: number;
  filterForDuplicates: () => void;
}

export function PotentialDuplicatesWarning({
  numberOfDuplicates,
  filterForDuplicates,
}: Readonly<PotentialDuplicatesWarningProps>) {
  return (
    <Alert
      message={formatPossibleDuplicates(numberOfDuplicates)}
      color="warning"
      action={{ text: "FILTER", onClick: filterForDuplicates }}
      sx={{
        border: "1px solid",
        borderColor: "warning.300",
        marginBottom: 2,
      }}
    />
  );
}
