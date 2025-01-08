/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAuditLogSourceFromJSON } from "@eshg/employee-portal-api/auditlog";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { FeedOutlined } from "@mui/icons-material";
import { Sheet } from "@mui/joy";

import { auditLogSourceNames } from "@/lib/shared/components/auditlog/constants";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";

export function AuditLogSheet({
  date,
  source,
}: {
  source: string | string[] | undefined;
  date: Date;
}) {
  return (
    <Sheet variant="soft">
      <DetailsRow alignItems="center" columnGap={4} rowGap={2}>
        <FeedOutlined />
        <DetailsCell
          name={"createdAt"}
          label={"Erstellungsdatum"}
          value={formatDate(date)}
        />
        <DetailsCell
          name={"source"}
          label={"Modul"}
          value={auditLogSourceNames[ApiAuditLogSourceFromJSON(source)]}
        />
      </DetailsRow>
    </Sheet>
  );
}
