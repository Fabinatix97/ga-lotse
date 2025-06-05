/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { TableOptions } from "@tanstack/react-table";

import { Table } from "@/lib/components/table/Table";
import { AuditTableHeader } from "@/lib/components/view/audit-log/tables/AuditTableHeader";
import { UniqueEntity } from "@/lib/helpers/entities";
import { useTranslation } from "@/lib/i18n/client";

interface AuditTableProps<TData> {
  data: TableOptions<TData>["data"];
  columns: TableOptions<TData>["columns"];
  title: string;
}

export function AuditTable<TData extends UniqueEntity>(
  props: Readonly<AuditTableProps<TData>>,
) {
  const { t } = useTranslation();

  return (
    <>
      <AuditTableHeader title={t(props.title)} />
      <Table data={props.data} columns={props.columns} />
    </>
  );
}
