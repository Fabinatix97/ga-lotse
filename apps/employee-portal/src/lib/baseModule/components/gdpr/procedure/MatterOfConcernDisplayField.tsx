/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import InfoIcon from "@mui/icons-material/InfoOutlined";
import { isString } from "remeda";

import { DetailsItem } from "@eshg/lib-employee-portal";

import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";

export function MatterOfConcernDisplayField({
  value,
  editable,
}: Readonly<{
  value: string | undefined;
  editable: boolean;
}>) {
  const isPresent = isString(value) && value.trim().length > 0;
  return (
    <DetailsItem
      label="Anliegen"
      value={isPresent || !editable ? value : "Bitte Anliegen eintragen."}
      slotProps={{
        value: {
          startDecorator: isPresent ? undefined : (
            <InfoIcon color="danger" size="md" />
          ),
          sx: {
            maxWidth: "100%",
            ...multiLineEllipsis(3),
          },
        },
      }}
    />
  );
}
