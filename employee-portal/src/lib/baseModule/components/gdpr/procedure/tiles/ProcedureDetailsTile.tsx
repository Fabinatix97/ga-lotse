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
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function ProcedureDetailsTile({
  procedure,
}: {
  procedure: ApiGetGdprProcedureResponse;
}) {
  return (
    <InfoTile name={"procedure-details"} title={"Vorgangsdaten"}>
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
    </InfoTile>
  );
}
