/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildExamination } from "@eshg/dental/api/models/ChildExamination";
import { useUpdateProphylaxisSessionParticipants } from "@eshg/dental/api/mutations/prophylaxisSessionApi";
import { routes } from "@eshg/dental/shared/routes";
import { GENDER_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect } from "react";
import { isDefined } from "remeda";

import { ExaminationStatusChip } from "@/lib/businessModules/dental/features/examinations/ExaminationStatusChip";
import { useAddChildToProphylaxisSessionSidebar } from "@/lib/businessModules/dental/features/prophylaxisSessions/AddChildToProphylaxisSessionSidebar";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { displayBoolean } from "@/lib/shared/helpers/booleans";
import {
  CustomSortingProps,
  useTableControl,
} from "@/lib/shared/hooks/searchParams/useTableControl";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import { ParticipantFilter, ParticipantFilterDef } from "./ParticipantFilter";
import {
  useFilteredParticipants,
  useProphylaxisSessionStore,
} from "./store/ProphylaxisSessionStoreProvider";
import {
  FluoridationConsentFilter,
  GenderFilter,
} from "./store/participantFilters";
import {
  ParticipantSortKey,
  ParticipantSorting,
} from "./store/participantSorting";

const GENDER_FILTERS: ParticipantFilterDef<GenderFilter>[] = [
  { label: "Alle", value: "ANY" },
  { label: "männlich", value: "MALE" },
  { label: "weiblich", value: "FEMALE" },
];

const FLUORIDATION_CONSENT_FILTERS: ParticipantFilterDef<FluoridationConsentFilter>[] =
  [
    { label: "Alle", value: "ANY" },
    { label: "Ja", value: "YES" },
    { label: "Nein", value: "NO" },
  ];

export function ProphylaxisSessionParticipantsTable() {
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const prophylaxisSessionVersion = useProphylaxisSessionStore(
    (state) => state.version,
  );
  const allParticipants = useProphylaxisSessionStore(
    (state) => state.participants,
  );
  const filteredParticipants = useFilteredParticipants();
  const participantSorting = useProphylaxisSessionStore(
    (state) => state.participantSorting,
  );
  const setParticipantSorting = useProphylaxisSessionStore(
    (state) => state.setParticipantSorting,
  );
  const { mutateAsync: updateParticipants } =
    useUpdateProphylaxisSessionParticipants(prophylaxisSessionId);
  const { openConfirmationDialog } = useConfirmationDialog();

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
            version: prophylaxisSessionVersion,
            participants: allParticipants
              .map((childExamination) => childExamination.childId)
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

  function routeToExamination(participantIndex: number) {
    return routes.prophylaxisSessions
      .byId(prophylaxisSessionId)
      .examinations.byIndex(participantIndex);
  }

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: {
      id: participantSorting.sortKey,
      desc: participantSorting.sortDirection === "desc",
    },
  });

  const { sortKey, sortDirection } = resolveTableSorting(
    tableControl.tableSorting,
  );
  useEffect(() => {
    setParticipantSorting({
      sortKey,
      sortDirection,
    });
  }, [setParticipantSorting, sortKey, sortDirection]);

  return (
    <TablePage
      controls={
        <ButtonBar
          left={
            <>
              <Stack>
                <Typography level="h4" component="h2" marginBottom={1}>
                  Teilnehmende Kinder
                </Typography>
                <Stack
                  direction="row"
                  gap={3}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <ParticipantFilter
                    name="gender"
                    label="Geschlecht"
                    filters={GENDER_FILTERS}
                  />
                  <Divider orientation="vertical" />
                  <ParticipantFilter
                    name="fluoridationConsent"
                    label="Fluoridierungseinverständnis"
                    filters={FLUORIDATION_CONSENT_FILTERS}
                  />
                </Stack>
              </Stack>
            </>
          }
          right={
            <>
              <AddChildButton />
              <InternalLinkButton href={routeToExamination(0)}>
                Reihenuntersuchung starten
              </InternalLinkButton>
            </>
          }
        />
      }
    >
      <DataTable
        data={filteredParticipants}
        columns={columnDefs(
          filteredParticipants.length,
          handleRemoveParticipant,
        )}
        rowNavigation={{
          focusColumnAccessorKey: "lastName",
          route: (row) => routeToExamination(row.index),
        }}
        sorting={tableControl.tableSorting}
        enableSortingRemoval={false}
      />
    </TablePage>
  );
}

const columnHelper = createColumnHelper<ChildExamination>();

function columnDefs(
  participantsSize: number,
  onRemoveParticipant: (participantId: string) => void,
) {
  const columnDefs = [
    columnHelper.accessor("firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 120,
      },
    }),
    columnHelper.accessor("lastName", {
      header: "Nachname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 120,
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 120,
      },
    }),
    columnHelper.accessor("groupName", {
      header: "Gruppe",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 90,
      },
    }),
    columnHelper.accessor("gender", {
      header: "Geschlecht",
      cell: (props) => {
        const value = props.getValue();
        return isDefined(value) ? GENDER_VALUES[value] : "";
      },
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 110,
      },
    }),
    columnHelper.accessor("fluoridationConsent", {
      header: "Fluoridierungseinverständnis",
      cell: (props) => displayBoolean(props.getValue()),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 110,
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => <ExaminationStatusChip status={props.getValue()} />,
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 110,
      },
    }),
  ];

  if (participantsSize > 1) {
    return [
      ...columnDefs,
      columnHelper.display({
        header: "Aktionen",
        id: "actions",
        cell: (props) => (
          <ActionsMenu
            actionItems={[
              {
                label: "Entfernen",
                startDecorator: <DeleteIcon />,
                onClick: () => onRemoveParticipant(props.row.original.childId),
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

  return columnDefs;
}

function resolveTableSorting(
  tableSorting: CustomSortingProps,
): ParticipantSorting {
  if (!tableSorting.manualSorting) {
    throw new Error("Table does not use server side sorting");
  }

  const sortingState = tableSorting.sortingState.at(0);
  if (sortingState === undefined) {
    throw new Error("Table does not have a sorting state");
  }

  return {
    sortKey: sortingState.id as ParticipantSortKey,
    sortDirection: sortingState.desc ? "desc" : "asc",
  };
}

function AddChildButton() {
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const prophylaxisSessionVersion = useProphylaxisSessionStore(
    (state) => state.version,
  );
  const institutionId = useProphylaxisSessionStore(
    (state) => state.institution.id,
  );
  const allParticipants = useProphylaxisSessionStore(
    (state) => state.participants,
  );
  const sidebar = useAddChildToProphylaxisSessionSidebar();

  return (
    <Button
      startDecorator={<Add />}
      onClick={() =>
        sidebar.open({
          prophylaxisSessionId,
          prophylaxisSessionVersion,
          institutionId,
          allParticipants,
        })
      }
    >
      Kind hinzufügen
    </Button>
  );
}
