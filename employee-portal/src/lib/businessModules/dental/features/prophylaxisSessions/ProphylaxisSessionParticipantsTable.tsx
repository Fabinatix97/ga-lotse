/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ChildExamination,
  routes,
  useDeleteProphylaxisSessionParticipantOptions,
} from "@eshg/dental";
import { ApiReasonForAbsence } from "@eshg/dental-api";
import {
  DataTable,
  TablePage,
  TableSortingProps,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { GENDER_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import StartIcon from "@mui/icons-material/Start";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { isDefined } from "remeda";

import { ExaminationStatusChip } from "@/lib/businessModules/dental/features/examinations/ExaminationStatusChip";
import { useAddChildToProphylaxisSessionSidebar } from "@/lib/businessModules/dental/features/prophylaxisSessions/AddChildToProphylaxisSessionSidebar";
import { ChangeReasonForAbsenceModal } from "@/lib/businessModules/dental/features/prophylaxisSessions/ChangeReasonForAbsenceModal";
import {
  useFilteredParticipants,
  useFilteredPresentParticipants,
  useProphylaxisSessionStore,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";
import {
  FluoridationConsentFilter,
  GenderFilter,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/participantFilters";
import {
  ParticipantSortKey,
  ParticipantSorting,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/participantSorting";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { displayBoolean } from "@/lib/shared/helpers/booleans";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import { ParticipantFilter, ParticipantFilterDef } from "./ParticipantFilter";

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
  const isScreening = useProphylaxisSessionStore((state) => state.isScreening);
  const isFluoridation = isDefined(
    useProphylaxisSessionStore((state) => state.fluoridationVarnish),
  );
  const isExamination = isFluoridation || isScreening;
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
  const { openConfirmationDialog } = useConfirmationDialog();
  const setExamination = useProphylaxisSessionStore(
    (state) => state.setExamination,
  );

  const deleteOptions = useDeleteProphylaxisSessionParticipantOptions(
    prophylaxisSessionId,
    prophylaxisSessionVersion,
    allParticipants,
  );
  const [examinationForAbsence, setExaminationForAbsence] =
    useState<ChildExamination>();

  function handleRemoveParticipant(childExternalId: string) {
    openConfirmationDialog({
      color: "danger",
      title: "Kind entfernen?",
      confirmLabel: "Entfernen",
      description: "Möchten Sie das Kind aus der Prophylaxe entfernen?",
      onConfirmMutation: {
        mutationOptions: deleteOptions,
        variableSupplier: () => childExternalId,
      },
      onConfirm: () => Promise.resolve(),
    });
  }

  function handleAbsentParticipant(examination: ChildExamination) {
    setExaminationForAbsence(examination);
  }

  function closeAbsenceModal() {
    setExaminationForAbsence(undefined);
  }

  function onSubmitAbsenceModal(examination: ChildExamination) {
    return function (reasonForAbsence: ApiReasonForAbsence) {
      setExamination(
        examination.examinationId,
        { type: "absence", reasonForAbsence },
        undefined,
      );
      setExaminationForAbsence(undefined);
    };
  }

  function routeToExamination(examinationId: string) {
    return routes.prophylaxisSessions
      .byId(prophylaxisSessionId)
      .examinations.byExaminationId(examinationId);
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

  const completedParticipants = allParticipants.filter(
    (participant) => participant.status !== "OPEN",
  ).length;

  const presentParticipants = useFilteredPresentParticipants();
  const firstParticipant = presentParticipants[0];

  return (
    <TablePage
      controls={
        <ButtonBar
          left={
            <Typography level="h3" component="h2">
              Teilnehmende Kinder
            </Typography>
          }
          right={
            <>
              <AddChildButton />
              {isExamination && firstParticipant !== undefined && (
                <InternalLinkButton
                  href={routeToExamination(firstParticipant.examinationId)}
                  endDecorator={<StartIcon />}
                >
                  Prophylaxe starten
                </InternalLinkButton>
              )}
            </>
          }
          invertDomOrder={true}
        />
      }
    >
      <Divider />
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" gap={3} alignItems="center" flexWrap="wrap">
          <Typography level="title-md">Filter:</Typography>
          <ParticipantFilter
            name="gender"
            label="Geschlecht"
            filters={GENDER_FILTERS}
          />
          {isFluoridation && (
            <ParticipantFilter
              name="fluoridationConsentGiven"
              label="Fluoridierungseinverständnis"
              filters={FLUORIDATION_CONSENT_FILTERS}
              sx={{ marginLeft: { xxs: 0, xl: 5 } }}
            />
          )}
        </Stack>
        {(isScreening || isFluoridation) && (
          <Stack direction="row" gap={2}>
            <Typography level="title-md">{`${completedParticipants} von ${allParticipants.length} abgeschlossen`}</Typography>
            <CheckCircleOutline color="success" />
          </Stack>
        )}
      </Stack>
      <DataTable
        data={filteredParticipants}
        columns={columnDefs(
          handleRemoveParticipant,
          handleAbsentParticipant,
          isFluoridation,
          isExamination,
        )}
        rowNavigation={
          isExamination
            ? {
                focusColumnAccessorKey: "lastName",
                route: (row) => routeToExamination(row.original.examinationId),
              }
            : undefined
        }
        sorting={tableControl.tableSorting}
        enableSortingRemoval={false}
        minWidth={1200}
      />
      {isDefined(examinationForAbsence) && (
        <OverlayBoundary>
          <ChangeReasonForAbsenceModal
            open={true}
            onCancel={closeAbsenceModal}
            onSubmit={onSubmitAbsenceModal(examinationForAbsence)}
            examination={examinationForAbsence}
          />
        </OverlayBoundary>
      )}
    </TablePage>
  );
}

const columnHelper = createColumnHelper<ChildExamination>();

function columnDefs(
  onRemoveParticipant: (participantId: string) => void,
  onAbsentParticipant: (examination: ChildExamination) => void,
  isFluoridation: boolean,
  isExamination: boolean,
) {
  return [
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
    ...(isFluoridation
      ? [
          columnHelper.accessor("currentFluoridationConsent", {
            header: "Fluoridierungseinverständnis",
            cell: (props) => displayBoolean(props.getValue()?.consented),
            enableSorting: true,
            meta: {
              canNavigate: { parentRow: true },
              width: 205,
            },
          }),
        ]
      : []),
    ...(isExamination
      ? [
          columnHelper.accessor("status", {
            header: "Status",
            cell: (props) => (
              <ExaminationStatusChip status={props.getValue()} />
            ),
            enableSorting: true,
            meta: {
              canNavigate: { parentRow: true },
              width: 110,
            },
          }),
        ]
      : []),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      cell: (props) =>
        childCanBeRemoved(props.row.original) ? (
          <ActionsMenu
            actionItems={[
              ...(props.row.original.status !== "CLOSED" && isExamination
                ? [
                    {
                      label: "Nicht anwesend",
                      startDecorator: <CancelIcon />,
                      onClick: () => onAbsentParticipant(props.row.original),
                    },
                  ]
                : []),
              {
                label: "Entfernen",
                startDecorator: <DeleteIcon />,
                onClick: () => onRemoveParticipant(props.row.original.childId),
                color: "danger",
              },
            ]}
          />
        ) : undefined,
      meta: {
        width: 80,
        cellStyle: "button",
        textAlign: "right",
      },
    }),
  ];
}

function resolveTableSorting(
  tableSorting: TableSortingProps,
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
      variant="outlined"
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

function childCanBeRemoved(child: ChildExamination) {
  return child.result === undefined;
}
