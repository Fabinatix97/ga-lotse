/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Button, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import {
  ChildResult,
  ProphylaxisSessionDetails as ProphylaxisSessionDetailsType,
} from "@/lib/businessModules/dental/api/models/ProphylaxisSessionDetails";
import { useUpdateProphylaxisSessionParticipants } from "@/lib/businessModules/dental/api/mutations/prophylaxisSessionApi";
import { useAddChildToProphylaxisSessionSidebar } from "@/lib/businessModules/dental/features/prophylaxisSessions/AddChildToProphylaxisSessionSidebar";
import { PROPHYLAXIS_TYPES } from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

interface ProphylaxisSessionDetailsProps {
  prophylaxisSession: ProphylaxisSessionDetailsType;
}

const columnHelper = createColumnHelper<ChildResult>();

function columnDefs(onRemoveParticipant: (participantId: string) => void) {
  return [
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
        width: 120,
      },
    }),
    columnHelper.accessor("groupName", {
      header: "Gruppe",
      cell: (props) => props.getValue(),
      enableSorting: false,
      meta: {
        width: 90,
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Entfernen",
              startDecorator: <DeleteIcon />,
              onClick: () => onRemoveParticipant(props.row.original.id),
              color: "danger",
            },
          ]}
        />
      ),
      meta: {
        width: 80,
        cellStyle: "button",
        textAlign: "right",
      },
    }),
  ];
}

export function ProphylaxisSessionDetails(
  props: ProphylaxisSessionDetailsProps,
) {
  const { mutateAsync: updateParticipants } =
    useUpdateProphylaxisSessionParticipants(props.prophylaxisSession.id);
  const { openConfirmationDialog } = useConfirmationDialog();
  const sidebar = useAddChildToProphylaxisSessionSidebar();
  const snackbar = useSnackbar();

  function handleRemoveParticipant(childExternalId: string) {
    openConfirmationDialog({
      color: "danger",
      title: "Kind entfernen?",
      confirmLabel: "Entfernen",
      description: "Möchten Sie das Kind aus der Prophylaxe entfernen?",
      onConfirm: async () => {
        await updateParticipants(
          {
            version: props.prophylaxisSession.version,
            participants: props.prophylaxisSession.participants
              .map((childResult) => childResult.id)
              .filter((id) => id !== childExternalId),
          },
          {
            onSuccess: () => {
              snackbar.confirmation("Kind erfolgreich entfernt.");
            },
          },
        );
      },
    });
  }

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
        <TablePage
          controls={
            <ButtonBar
              left={
                <Typography level="h4" component="h2" marginBottom={1}>
                  Teilnehmende Kinder
                </Typography>
              }
              right={
                <Button
                  startDecorator={<Add />}
                  onClick={() =>
                    sidebar.open({
                      prophylaxisSession: props.prophylaxisSession,
                    })
                  }
                >
                  Kind hinzufügen
                </Button>
              }
            />
          }
        >
          <DataTable
            data={props.prophylaxisSession.participants}
            columns={columnDefs(handleRemoveParticipant)}
          />
        </TablePage>
      </ContentPanel>
    </Stack>
  );
}
