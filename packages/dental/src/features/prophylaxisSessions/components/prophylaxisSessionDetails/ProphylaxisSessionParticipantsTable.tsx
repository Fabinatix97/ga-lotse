/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Add,
  Cancel,
  Check,
  CheckCircleOutline,
  DeleteOutlined,
  Start,
} from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { isDefined } from "remeda";

import { ApiProphylaxisStatus, ApiReasonForAbsence } from "@eshg/dental-api";
import {
  ActionsItem,
  ActionsMenu,
  ButtonBar,
  DataTable,
  OpenModalButton,
  OverlayBoundary,
  TablePage,
  TableSortingProps,
  formatBoolean,
  useConfirmationDialog,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  GENDER_VALUES,
  InternalLinkButton,
  formatDate,
} from "@eshg/lib-portal";

import { ExaminationStatusChip } from "../../../../components/examination/ExaminationStatusChip";
import { routes } from "../../../../config/routes";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";
import { useDeleteProphylaxisSessionParticipantOptions } from "../../api/mutations/details";
import {
  useFilteredParticipants,
  useProphylaxisSessionStore,
} from "../../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";
import {
  FluoridationConsentFilter,
  GenderFilter,
} from "../../stores/prophylaxisSession/participantFilters";
import {
  ParticipantSortKey,
  ParticipantSorting,
} from "../../stores/prophylaxisSession/participantSorting";
import { canBeMarkedAbsent } from "../../utils/canBeMarkedAbsent";
import { ChangeReasonForAbsenceModal } from "../absence/ChangeReasonForAbsenceModal";

import { useAddChildToProphylaxisSessionSidebar } from "./AddChildToProphylaxisSessionSidebar";
import { CloseProphylaxisSessionModal } from "./CloseProphylaxisSessionModal";
import { ParticipantFilter, ParticipantFilterDef } from "./ParticipantFilter";

const GENDER_FILTERS: ParticipantFilterDef<GenderFilter>[] = [
  { label: "Alle", value: "ANY" },
  { label: "männlich", value: "MALE" },
  { label: "weiblich", value: "FEMALE" },
  { label: "andere", value: "OTHER" },
];

const FLUORIDATION_CONSENT_FILTERS: ParticipantFilterDef<FluoridationConsentFilter>[] =
  [
    { label: "Alle", value: "ANY" },
    { label: "ja", value: "YES" },
    { label: "nein", value: "NO" },
    { label: "liegt nicht vor", value: "NOT_AVAILABLE" },
  ];

export function ProphylaxisSessionParticipantsTable() {
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const isScreening = useProphylaxisSessionStore((state) => state.isScreening);
  const isFluoridation = isDefined(
    useProphylaxisSessionStore((state) => state.fluoridationVarnish),
  );
  const isExamination = isFluoridation || isScreening;
  const status = useProphylaxisSessionStore((state) => state.status);
  const prophylaxisSessionVersion = useProphylaxisSessionStore(
    (state) => state.version,
  );
  const allParticipants = useProphylaxisSessionStore(
    (state) => state.participants,
  );
  const filteredParticipants = useFilteredParticipants();
  const participantsToBeExamined = useProphylaxisSessionStore(
    (state) => state.participantsToBeExamined,
  );
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
    useState<ProphylaxisSessionExamination>();

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

  function handleAbsentParticipant(examination: ProphylaxisSessionExamination) {
    setExaminationForAbsence(examination);
  }

  function closeAbsenceModal() {
    setExaminationForAbsence(undefined);
  }

  function onSubmitAbsenceModal(examination: ProphylaxisSessionExamination) {
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

  const firstParticipant = participantsToBeExamined[0];
  const allParticipantsCompleted =
    completedParticipants > 0 &&
    completedParticipants === allParticipants.length;

  return (
    <TablePage
      controls={
        <ButtonBar
          left={
            <Stack direction="row" gap={3}>
              <Typography level="h3" component="h2">
                Teilnehmende Kinder
              </Typography>
              {(isScreening || isFluoridation) && (
                <Stack direction="row" gap={2}>
                  <Typography level="title-md">{`${completedParticipants} von ${allParticipants.length} abgeschlossen`}</Typography>
                  <CheckCircleOutline color="success" />
                </Stack>
              )}
            </Stack>
          }
          right={
            status === ApiProphylaxisStatus.Open && (
              <>
                <AddChildButton />
                {allParticipantsCompleted || !isExamination ? (
                  <CloseProphylaxisButton />
                ) : isExamination && firstParticipant !== undefined ? (
                  <InternalLinkButton
                    href={routeToExamination(firstParticipant.examinationId)}
                    endDecorator={<Start />}
                  >
                    Prophylaxe starten
                  </InternalLinkButton>
                ) : null}
              </>
            )
          }
          invertDomOrder
        />
      }
    >
      <Divider />
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
        minWidth={1400}
      />
      {isDefined(examinationForAbsence) && (
        <OverlayBoundary>
          <ChangeReasonForAbsenceModal
            open
            examination={examinationForAbsence}
            onCancel={closeAbsenceModal}
            onSubmit={onSubmitAbsenceModal(examinationForAbsence)}
          />
        </OverlayBoundary>
      )}
    </TablePage>
  );
}

const columnHelper = createColumnHelper<ProphylaxisSessionExamination>();

function columnDefs(
  onRemoveParticipant: (participantId: string) => void,
  onAbsentParticipant: (examination: ProphylaxisSessionExamination) => void,
  isFluoridation: boolean,
  isExamination: boolean,
) {
  return [
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
              width: 160,
            },
          }),
        ]
      : []),
    columnHelper.accessor("firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 250,
      },
    }),
    columnHelper.accessor("lastName", {
      header: "Nachname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 250,
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 160,
      },
    }),
    columnHelper.accessor("groupName", {
      header: "Gruppe",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
        width: 100,
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
        width: 130,
      },
    }),
    ...(isFluoridation
      ? [
          columnHelper.accessor("currentFluoridationConsent", {
            header: "Fluoridierungseinverständnis",
            cell: (props) => formatBoolean(props.getValue()?.consented),
            enableSorting: true,
            meta: {
              canNavigate: { parentRow: true },
              width: 260,
            },
          }),
        ]
      : []),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      cell: (props) => {
        const deleteAction: ActionsItem = {
          label: "Entfernen",
          startDecorator: <DeleteOutlined />,
          onClick: () => onRemoveParticipant(props.row.original.id),
          color: "danger",
        };
        const absentAction: ActionsItem = {
          label: "Nicht anwesend",
          startDecorator: <Cancel />,
          onClick: () => onAbsentParticipant(props.row.original),
        };
        const actions: ActionsItem[] = [
          ...(canBeMarkedAbsent(
            props.row.original.status,
            props.row.original.result,
          ) && isExamination
            ? [absentAction]
            : []),
          ...(childCanBeRemoved(props.row.original) ? [deleteAction] : []),
        ];
        return actions.length > 0 ? (
          <ActionsMenu actionItems={actions} />
        ) : undefined;
      },
      meta: {
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

function CloseProphylaxisButton() {
  return (
    <OpenModalButton
      color="success"
      endDecorator={<Check />}
      renderModal={(modalProps) => (
        <CloseProphylaxisSessionModal {...modalProps} />
      )}
    >
      Prophylaxe abschließen
    </OpenModalButton>
  );
}

function childCanBeRemoved(child: ProphylaxisSessionExamination) {
  return child.result === undefined;
}
