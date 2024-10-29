/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/employee-portal-api/measlesProtection";
import { SxProps } from "@mui/joy/styles/types";

import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";

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
    <DetailsCard
      key={`custodian-${index}`}
      title="PSB - Personensorgeberechtigte:r"
    >
      <CentralFilePersonDetails
        person={{
          ...person,
          contactAddress: person.address,
        }}
        columnSx={COLUMN_STYLE}
      />
    </DetailsCard>
  ));
}
