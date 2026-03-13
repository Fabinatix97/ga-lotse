/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip, Sheet } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import {
  DataTable,
  DetailsSection,
  PROCEDURE_STATUS_COLORS,
  TablePage,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  OPTIONAL_FALLBACK_VALUE,
  formatDateTime,
  useNavigation,
} from "@eshg/lib-portal";
import {
  ApiProcedureStatus,
  ApiProstituteProtectionProcedureType,
} from "@eshg/prostitute-protection-api";

import { usePersonSearchOptions } from "../../../api/queries/person";
import { routes } from "../../../config/routes";
import { useDecryptedPersons } from "../../../contexts/decryptedPersons/DecryptedPersonsStoreProvider";
import {
  ADDITIONAL_DATA_FIELD_NAME,
  PROCEDURE_STATUS_VALUES,
  PROCEDURE_TYPE_VALUES,
} from "../../../shared/constants";

interface RelatedProceduresResult {
  id: string;
  procedureType: ApiProstituteProtectionProcedureType;
  appointmentStart?: Date;
  creatorName?: string;
  consultantName?: string;
  status: ApiProcedureStatus;
}

const initialSorting: ColumnSort = {
  id: "appointmentStart",
  desc: false,
};

const columnHelper = createColumnHelper<RelatedProceduresResult>();

function getRelatedProceduresColumns() {
  return [
    columnHelper.accessor("procedureType", {
      header: "Beratungstyp",
      cell: ({ getValue }) => {
        const key = getValue();
        return key ? PROCEDURE_TYPE_VALUES[key] : OPTIONAL_FALLBACK_VALUE;
      },
      enableSorting: false,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) => formatDateTime(getValue()),
      enableSorting: true,
      meta: { width: 200, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("creatorName", {
      header: ADDITIONAL_DATA_FIELD_NAME.createdBy,
      cell: ({ getValue }) => getValue() ?? OPTIONAL_FALLBACK_VALUE,
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("consultantName", {
      header: ADDITIONAL_DATA_FIELD_NAME.consultant,
      cell: ({ getValue }) => getValue() ?? OPTIONAL_FALLBACK_VALUE,
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <Chip color={PROCEDURE_STATUS_COLORS[getValue()]}>
          {PROCEDURE_STATUS_VALUES[getValue()]}
        </Chip>
      ),
      enableSorting: false,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
  ];
}

export function RelatedProceduresTable({
  procedureId,
}: Readonly<{
  procedureId: string;
}>) {
  const { addDecryptedPerson, getDecryptedPerson } = useDecryptedPersons();
  const personData = getDecryptedPerson(procedureId);
  const { tryNavigate } = useNavigation();

  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
  });

  const personSearchOptions = usePersonSearchOptions({
    search: personData,
    page: tableControl.paginationProps,
    sorting: tableControl.tableSorting,
  });

  const { data } = useQuery({
    ...personSearchOptions,
    select: (data) =>
      data.elements.filter((procedure) => procedure.id !== procedureId),
    gcTime: 60000,
    staleTime: 60000,
  });

  return (
    <Sheet>
      <DetailsSection title="Vorgänge">
        <TablePage
          aria-label="Zugehörige Vorgänge"
          data-testid="related-procedures-table"
        >
          <DataTable
            data={data ?? []}
            columns={getRelatedProceduresColumns()}
            sorting={tableControl.tableSorting}
            rowNavigation={{
              onClick: (row) => () => {
                if (personData) {
                  addDecryptedPerson({
                    ...personData,
                    id: row.original.id,
                  });
                }
                tryNavigate(routes.procedures.byId(row.original.id).details);
              },
              focusColumnAccessorKey: "appointmentStart",
            }}
          />
        </TablePage>
      </DetailsSection>
    </Sheet>
  );
}
