/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";

import {
  ButtonBar,
  DataTable,
  OverlayBoundary,
  TablePage,
  TableSheet,
  ToggleFilterButton,
} from "@eshg/lib-employee-portal";

import { AuditlogDeletePasswordButton } from "@/lib/auditlog/components/AuditlogDeletePasswordButton";
import { useGetAccessibleAuditLogs } from "@/lib/auditlog/queries/auditlog";
import { routes } from "@/lib/baseModule/shared/routes";

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
            left={<ToggleFilterButton disabled />}
            right={<AuditlogDeletePasswordButton />}
          />
        }
      >
        <TableSheet>
          <DataTable
            data={response.accessibleAuditLogs}
            columns={auditLogAccessibleColumns}
            rowNavigation={{
              route: (row) =>
                routes.auditlog.access(
                  row.original.auditLog.source,
                  format(row.original.auditLog.date, "yyyy-MM-dd"),
                ),
              focusColumnAccessorKey: "auditLog.source",
            }}
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
