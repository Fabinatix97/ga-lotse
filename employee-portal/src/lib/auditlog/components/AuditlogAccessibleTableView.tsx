/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";

import { AuditlogDeletePasswordButton } from "@/lib/auditlog/components/AuditlogDeletePasswordButton";
import { useGetAccessibleAuditLogs } from "@/lib/auditlog/queries/auditlog";
import { routes } from "@/lib/baseModule/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

import { AuditLogDecryptSidebar } from "./AuditLogDecryptSidebar";
import { auditLogAccessibleColumns } from "./auditLogAccessibleColumns";

interface AuditlogAccessibleTableViewProps {
  encryptedPrivateKey: string[];
}

export function AuditlogAccessibleTableView({
  encryptedPrivateKey,
}: AuditlogAccessibleTableViewProps) {
  const { data: response } = useGetAccessibleAuditLogs();
  const { source } = useParams();
  const openSidebar = typeof source === "string";

  const router = useRouter();

  return (
    <>
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
            rowNavRoute={(row) =>
              routes.auditlog.access(
                row.original.auditLog.source,
                format(row.original.auditLog.date, "yyyy-MM-dd"),
              )
            }
          />
        </TableSheet>
      </TablePage>
      {openSidebar && (
        <OverlayBoundary>
          <AuditLogDecryptSidebar
            encryptedPrivateKey={encryptedPrivateKey}
            open={openSidebar}
            onClose={() => router.push(routes.auditlog.index)}
          />
        </OverlayBoundary>
      )}
    </>
  );
}
