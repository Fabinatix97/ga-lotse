/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetGdprProcedureResponse } from "@eshg/employee-portal-api/base";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";

import {
  statusTranslation,
  typeTranslation,
} from "@/lib/baseModule/components/gdpr/i18n";
import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";

export function ProcedureDetailsTile({
  procedure,
}: {
  procedure: ApiGetGdprProcedureResponse;
}) {
  return (
    <SectionTile id={"procedure-details"}>
      <SectionTitle id={"procedure-details"}>Vorgangsdaten</SectionTitle>
      <DetailsCell
        name={"createdAt"}
        label={"Erstellt"}
        value={formatDateTime(procedure.createdAt)}
      />
      <DetailsCell
        name={"type"}
        label={"Vorgangsart"}
        value={typeTranslation[procedure.type]}
        avoidWrap
      />
      <DetailsCell
        name={"status"}
        label={"Status"}
        value={statusTranslation[procedure.status]}
      />
    </SectionTile>
  );
}
