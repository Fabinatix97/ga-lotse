/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AuditlogDeletePasswordButton } from "@/lib/auditlog/components/AuditlogDeletePasswordButton";
import { auditLogAccessibleColumns } from "@/lib/auditlog/components/auditLogAccessibleColumns";
import { useGetAccessibleAuditLogs } from "@/lib/auditlog/queries/auditlog";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function AuditlogAccessibleTableView() {
  const { data: response } = useGetAccessibleAuditLogs();

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={<FilterButton disabled />}
          right={<AuditlogDeletePasswordButton />}
        />
      }
    >
      <TableSheet>
        <DataTable
          data={response.accessibleAuditLogs}
          columns={auditLogAccessibleColumns}
        />
      </TableSheet>
    </TablePage>
  );
}
