/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";

import { buildEnumOptions } from "@eshg/lib-portal";

import { CERTIFICATE_TYPE_VALUES } from "../../../shared/constants";
import { SelectableCardsField } from "../../form/formFields/SelectableCardsField";

export function CertificateTypeSection() {
  return (
    <Sheet component={Stack}>
      <Typography level="h3" mb={3}>
        Art des Zertifikats
      </Typography>
      <SelectableCardsField
        name="certificateType"
        required="Bitte die Art des Zertifikats auswählen"
        options={buildEnumOptions(CERTIFICATE_TYPE_VALUES).map(
          ({ label, value }) => ({
            value,
            content: <Typography>{label}</Typography>,
          }),
        )}
      />
    </Sheet>
  );
}
