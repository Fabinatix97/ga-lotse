/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CentralFilePersonDetails,
  DetailsSection,
} from "@eshg/lib-employee-portal";
import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";
import { Sheet } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

export function Custodians({
  procedure,
}: {
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}) {
  const length = procedure?.custodians?.length ?? 0;
  if (procedure?.custodians == null || length === 0) {
    return;
  }
  const custodians = procedure.custodians ?? [];

  return custodians.map((person, index) => (
    <Sheet key={`custodian-${index}`}>
      <DetailsSection title="PSB - Personensorgeberechtigte:r">
        <CentralFilePersonDetails
          person={{
            ...person,
            contactAddress: person.address,
          }}
          columnSx={COLUMN_STYLE}
        />
      </DetailsSection>
    </Sheet>
  ));
}
