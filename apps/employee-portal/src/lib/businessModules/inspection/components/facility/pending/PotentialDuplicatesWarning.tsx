/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Alert } from "@eshg/lib-portal";

import { formatPossibleDuplicates } from "@/lib/businessModules/inspection/components/processImport/formatters";

export interface PotentialDuplicatesFilterProps {
  onFilterForDuplicates: () => void;
}

interface PotentialDuplicatesWarningProps extends PotentialDuplicatesFilterProps {
  numberOfDuplicates: number;
}

export function PotentialDuplicatesWarning({
  numberOfDuplicates,
  onFilterForDuplicates,
}: Readonly<PotentialDuplicatesWarningProps>) {
  return (
    <Alert
      message={formatPossibleDuplicates(numberOfDuplicates)}
      color="warning"
      action={{ text: "FILTER", onClick: onFilterForDuplicates }}
      sx={{
        border: "1px solid",
        borderColor: "warning.300",
        marginBottom: 2,
      }}
    />
  );
}
