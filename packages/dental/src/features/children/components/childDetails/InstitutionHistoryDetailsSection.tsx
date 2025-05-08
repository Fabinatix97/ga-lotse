/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createColumnHelper } from "@tanstack/react-table";

import {
  DataTable,
  DetailsSection,
  formatSchoolYear,
} from "@eshg/lib-employee-portal";

import { AnnualInstitution } from "../../../../api/models/AnnualInstitution";

const columnHelper = createColumnHelper<AnnualInstitution>();
const COLUMNS = [
  columnHelper.accessor("institution.name", {
    header: "Einrichtung",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 120,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("year", {
    header: "Schuljahr",
    cell: (props) => formatSchoolYear(props.getValue()),
    enableSorting: true,
    meta: {
      width: 90,
      canNavigate: { parentRow: true },
    },
  }),
];

interface InstitutionHistoryDetailsSectionProps {
  institutions: AnnualInstitution[];
}

export function InstitutionHistoryDetailsSection(
  props: InstitutionHistoryDetailsSectionProps,
) {
  return (
    <DetailsSection title="Besuchte Einrichtungen">
      <DataTable
        data={props.institutions}
        columns={COLUMNS}
        enableSortingRemoval={false}
        minWidth={500}
      />
    </DetailsSection>
  );
}
