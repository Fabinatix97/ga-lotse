/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import {
  ChildKeyAttributes,
  ProphylaxisSessionDetails as ProphylaxisSessionDetailsType,
} from "@/lib/businessModules/dental/api/models/ProphylaxisSessionDetails";
import { PROPHYLAXIS_TYPES } from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

interface ProphylaxisSessionDetailsProps {
  prophylaxisSession: ProphylaxisSessionDetailsType;
}

const columnHelper = createColumnHelper<ChildKeyAttributes>();
const PARTICIPANTS_COLUMNS = [
  columnHelper.accessor("lastName", {
    header: "Name",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 120,
    },
  }),
  columnHelper.accessor("firstName", {
    header: "Vorname",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 120,
    },
  }),
  columnHelper.accessor("dateOfBirth", {
    header: "Geburtsdatum",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: false,
    meta: {
      width: 90,
    },
  }),
];

export function ProphylaxisSessionDetails(
  props: ProphylaxisSessionDetailsProps,
) {
  return (
    <Stack gap={4}>
      <ContentPanel testId="prophylaxis-session-panel">
        <DetailsSection
          title="Allg. Informationen"
          data-testid="prophylaxis-details"
        >
          <DetailsColumn>
            <DetailsCell
              label="Datum"
              value={formatDateTime(props.prophylaxisSession.dateAndTime)}
            />
            <DetailsCell
              label="Einrichtung"
              value={props.prophylaxisSession.institution.name}
            />
            <DetailsCell
              label="Gruppe"
              value={props.prophylaxisSession.groupName}
            />
            <DetailsCell
              label="Typ"
              value={PROPHYLAXIS_TYPES[props.prophylaxisSession.type]}
            />
          </DetailsColumn>
        </DetailsSection>
      </ContentPanel>
      <ContentPanel>
        <TablePage>
          <TableSheet
            title={
              <Typography level="h3" component="h2" marginBottom={1}>
                Teilnehmende Kinder
              </Typography>
            }
          >
            <DataTable
              data={props.prophylaxisSession.participants}
              columns={PARTICIPANTS_COLUMNS}
            />
          </TableSheet>
        </TablePage>
      </ContentPanel>
    </Stack>
  );
}
