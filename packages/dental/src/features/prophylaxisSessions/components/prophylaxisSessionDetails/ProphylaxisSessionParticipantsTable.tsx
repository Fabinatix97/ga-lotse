/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccountCircleOutlined,
  Add,
  Cancel,
  CancelOutlined,
  Check,
  CheckCircleOutline,
  CheckCircleOutlined,
  CircleOutlined,
  DeleteOutlined,
  OpenInNewOutlined,
  Start,
} from "@mui/icons-material";
import { Button, Divider, Stack, Tooltip, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { isDefined } from "remeda";

import {
  ApiBooleanWithUnknown,
  ApiProphylaxisStatus,
  ApiReasonForAbsence,
} from "@eshg/dental-api";
import {
  ActionsItem,
  ActionsMenu,
  ButtonBar,
  DataTable,
  OpenModalButton,
  OverlayBoundary,
  TablePage,
  TableSortingProps,
  useConfirmationDialog,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  ExternalLink,
  GENDER_VALUES,
  InternalLinkButton,
  formatDate,
} from "@eshg/lib-portal";

import { FluoridationExaminationResult } from "../../../../api/models/ExaminationResult";
import { ExaminationStatusChip } from "../../../../components/examination/ExaminationStatusChip";
import { routes } from "../../../../config/routes";
import { FluoridationConsent } from "../../../../utils/childDetails/FluoridationConsent";
import { formatBooleanWithUnknown } from "../../../../utils/formatters";
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
import { FluoridationConsentChip } from "./FluoridationConsentChip";
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
      description: "Möchten Sie das Kind aus der Maßnahme entfernen?",
      onConfirmMutation: {
        mutationOptions: deleteOptions,
        variableSupplier: () => childExternalId,
      },
      onConfirm: () => Promise.resolve(),
    });
  }

  function handleUpdateFluoridationResult(
    examination: ProphylaxisSessionExamination,
    fluorideVarnishApplied: boolean | undefined,
  ) {
    setExamination(
      examination.examinationId,
      isDefined(fluorideVarnishApplied)
        ? { type: "fluoridation", fluorideVarnishApplied }
        : undefined,
      examination.note,
    );
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
        examination.note,
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
              {isExamination && (
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
                {!isScreening && isFluoridation && (
                  <UpdateAllFluoridationButton />
                )}
                {allParticipantsCompleted || !isExamination ? (
                  <CloseProphylaxisButton />
                ) : isScreening && firstParticipant !== undefined ? (
                  <InternalLinkButton
                    href={routeToExamination(firstParticipant.examinationId)}
                    endDecorator={<Start />}
                  >
                    Untersuchung starten
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
      <Stack
        direction="row"
        gap={3}
        alignItems="center"
        flexWrap="wrap"
        role="group"
        aria-labelledby="filter-label"
      >
        <Typography id="filter-label" level="title-md">
          Filter:
        </Typography>
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
          />
        )}
      </Stack>
      <DataTable
        data={filteredParticipants}
        columns={columnDefs(
          handleRemoveParticipant,
          handleAbsentParticipant,
          handleUpdateFluoridationResult,
          isFluoridation,
          isScreening,
        )}
        rowNavigation={
          isScreening
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

interface FluoridationStatus {
  result: FluoridationExaminationResult | undefined;
  fluoridationConsent: FluoridationConsent | undefined;
}

function columnDefs(
  onRemoveParticipant: (participantId: string) => void,
  onAbsentParticipant: (examination: ProphylaxisSessionExamination) => void,
  onUpdateFluoridationResult: (
    examination: ProphylaxisSessionExamination,
    fluorideVarnishApplied: boolean | undefined,
  ) => void,
  isFluoridation: boolean,
  isScreening: boolean,
) {
  const isFluoridationOnly = isFluoridation && !isScreening;
  return [
    ...(isScreening
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
    ...(isFluoridationOnly
      ? [
          columnHelper.accessor(
            (row) => {
              return {
                result: row.result,
                fluoridationConsent: row.currentFluoridationConsent,
              } as FluoridationStatus;
            },
            {
              header: "Fluoridierung",
              cell: (props) => (
                <FluoridationConsentChip
                  result={props.getValue().result}
                  fluoridationConsent={props.getValue().fluoridationConsent}
                />
              ),
              enableSorting: true,
              meta: {
                canNavigate: { parentRow: true },
                width: 180,
              },
            },
          ),
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
            header: () => (
              <Tooltip title="Fluoridierungseinverständnis">
                <Typography>Fluorid. EV</Typography>
              </Tooltip>
            ),
            cell: (props) =>
              formatBooleanWithUnknown(props.getValue()?.consented),
            enableSorting: true,
            meta: {
              canNavigate: { parentRow: true },
              width: 130,
            },
          }),
        ]
      : []),
    columnHelper.accessor("updatePending", {
      header: () => (
        <Tooltip title="Persönliche Daten">
          <Typography>Pers. Daten</Typography>
        </Tooltip>
      ),
      cell: (props) =>
        props.getValue() && (
          <ExternalLink
            href={routes.children.byId(props.row.original.id).details}
            openInNewTab
            sx={{ alignSelf: "flex-end" }}
            endDecorator={<OpenInNewOutlined />}
          >
            Update
          </ExternalLink>
        ),
      enableSorting: true,
      meta: {
        width: 130,
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      cell: (props) => {
        const row = props.row.original;
        const deleteAction: ActionsItem = {
          label: "Entfernen",
          startDecorator: <DeleteOutlined />,
          onClick: () => onRemoveParticipant(row.id),
          color: "danger",
        };
        const absentAction: ActionsItem = {
          label: "Nicht anwesend",
          startDecorator: <Cancel />,
          onClick: () => onAbsentParticipant(row),
        };

        const fluoridationDoneAction: ActionsItem = {
          label: "Fluoridierung durchgeführt",
          startDecorator: <CheckCircleOutlined />,
          onClick: () => onUpdateFluoridationResult(row, true),
        };
        const fluoridationNotDoneAction: ActionsItem = {
          label: "Fluoridierung nicht durchgeführt",
          startDecorator: <CancelOutlined />,
          onClick: () => onUpdateFluoridationResult(row, false),
        };
        const fluoridationOpenAction: ActionsItem = {
          label: "Fluoridierung offen",
          startDecorator: <CircleOutlined />,
          onClick: () => onUpdateFluoridationResult(row, undefined),
        };
        const navigateToProfileAction: ActionsItem = {
          label: "Zum Profil",
          startDecorator: <AccountCircleOutlined />,
          onClick: routes.children.byId(row.id).details,
          openInNewTab: true,
        };
        const actions: ActionsItem[] = [
          ...(isFluoridationOnly && canChangeToFluorideVarnishApplied(true, row)
            ? [fluoridationDoneAction]
            : []),
          ...(isFluoridationOnly &&
          canChangeToFluorideVarnishApplied(false, row)
            ? [fluoridationNotDoneAction]
            : []),
          ...(isFluoridationOnly &&
          canChangeToFluorideVarnishApplied(undefined, row)
            ? [fluoridationOpenAction]
            : []),
          ...(isScreening || isFluoridation ? [navigateToProfileAction] : []),
          ...(canBeMarkedAbsent(row.status, row.result) &&
          (isScreening || isFluoridation)
            ? [absentAction]
            : []),
          ...(childCanBeRemoved(row) ? [deleteAction] : []),
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

function canChangeToFluorideVarnishApplied(
  targetFluorideVarnishApplied: boolean | undefined,
  examination: ProphylaxisSessionExamination,
) {
  if (
    examination.status === "NOT_PRESENT" &&
    targetFluorideVarnishApplied === undefined
  ) {
    return true;
  }

  if (
    examination.currentFluoridationConsent?.consented !==
    ApiBooleanWithUnknown.True
  ) {
    return false;
  }

  if (examination.status === "NOT_PRESENT") {
    return true;
  }

  if (examination.result === undefined) {
    return targetFluorideVarnishApplied !== undefined;
  }

  return (
    examination.result.type === "fluoridation" &&
    examination.result.fluorideVarnishApplied !== targetFluorideVarnishApplied
  );
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

function UpdateAllFluoridationButton() {
  const allParticipants = useProphylaxisSessionStore(
    (state) => state.participants,
  );

  const participantsToBeUpdated = allParticipants
    .filter(
      (participant) =>
        participant.currentFluoridationConsent?.consented ===
        ApiBooleanWithUnknown.True,
    )
    .filter((participant) => participant.result === undefined)
    .map((p) => p.examinationId);

  const setExaminations = useProphylaxisSessionStore(
    (state) => state.setExaminations,
  );

  if (participantsToBeUpdated.length === 0) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      onClick={() =>
        setExaminations(participantsToBeUpdated, {
          type: "fluoridation",
          fluorideVarnishApplied: true,
        })
      }
    >
      Alle Fluoridierungen erledigt
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
      Untersuchung abschließen
    </OpenModalButton>
  );
}

function childCanBeRemoved(child: ProphylaxisSessionExamination) {
  return child.result === undefined;
}
