/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Circle } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { AriaRole, PropsWithChildren, useId, useMemo } from "react";

import {
  APPOINTMENT_TYPES,
  ButtonBar,
  SidebarActions,
  SidebarContent,
  calculateMaxParallelBookings,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { Alert, QueryKeyFactory, formatUserName } from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../../api/AppointmentBlockApi";
import { useDeleteAppointmentBlock } from "../../../api/mutations/appointmentBlock";
import { useGetAppointmentBlock } from "../../../api/queries/appointmentBlock";
import {
  Appointment,
  AppointmentBlock,
  AppointmentBlockUser,
} from "../AppointmentBlockGroup";

interface DisplayAppointmentBlockProps {
  onUpdate: () => void;
  onClose: (force?: boolean) => void;
  refetchEvents: () => void;
  isLimitedView: boolean | undefined;
  appointmentBlockId: string;
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
}

export function DisplayAppointmentBlockSidebar({
  appointmentBlockApi,
  appointmentBlockId,
  onClose,
  ...props
}: DisplayAppointmentBlockProps) {
  const { data: appointmentBlock } = useGetAppointmentBlock(
    appointmentBlockId,
    appointmentBlockApi,
    props.appointmentBlockApiQueryKey,
  );

  const { openConfirmationDialog } = useConfirmationDialog();

  const deleteAppointmentBlock = useDeleteAppointmentBlock(appointmentBlockApi);
  const canDeleteAppointmentBlock =
    appointmentBlock.bookedAppointments?.length === 0;
  const formattedAppointmentDate = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "short",
  }).formatRange(appointmentBlock.start, appointmentBlock.end);

  function deleteAppointmentBlockWithConfirmation() {
    openConfirmationDialog({
      title: "Terminblock löschen?",
      description: "Möchten Sie den Terminblock wirklich löschen?",
      confirmLabel: "Löschen",
      color: "danger",
      onConfirm: async () => {
        await deleteAppointmentBlock.mutateAsync(
          { appointmentBlockId },
          {
            onSuccess: () => {
              close();
            },
          },
        );
        props.refetchEvents();
        onClose(true);
      },
    });
  }

  const usersData = useMemo(
    () => getUsersByRolesForAppointmentBlock(appointmentBlock),
    [appointmentBlock],
  );

  return (
    <>
      <SidebarContent title="Terminblock">
        <Stack gap={2}>
          <Stack gap={1} direction="row">
            <Circle sx={{ color: (theme) => theme.palette.success.solidBg }} />
            <Typography level="title-md">{formattedAppointmentDate}</Typography>
          </Stack>
          <Divider />

          {!canDeleteAppointmentBlock && (
            <Alert
              color="primary"
              title="Information"
              message="Es können nur Terminblöcke gelöscht werden, welche noch keine Termine enthalten."
            />
          )}

          <Stack gap={2} role="list" aria-label="Termindetails">
            {usersData.physicians && (
              <DetailsBlock title="Ärzte/Ärztinnen:" contentRole="list">
                {usersData.physicians?.map(({ id, name }) => (
                  <Typography key={id} level="body-md" role="listitem">
                    {name}
                  </Typography>
                ))}
              </DetailsBlock>
            )}
            {usersData.mfas && (
              <DetailsBlock title="MFA:" contentRole="list">
                {usersData.mfas?.map(({ id, name }) => (
                  <Typography key={id} level="body-md" role="listitem">
                    {name}
                  </Typography>
                ))}
              </DetailsBlock>
            )}
            {usersData.sopasss && (
              <DetailsBlock
                title="SOPASS qualifizierte:r MFA:"
                contentRole="list"
              >
                {usersData.sopasss?.map(({ id, name }) => (
                  <Typography key={id} level="body-md" role="listitem">
                    {name}
                  </Typography>
                ))}
              </DetailsBlock>
            )}
            {usersData.consultants && (
              <DetailsBlock title="Berater:innen" contentRole="list">
                {usersData.consultants?.map(({ id, name }) => (
                  <Typography key={id} level="body-md" role="listitem">
                    {name}
                  </Typography>
                ))}
              </DetailsBlock>
            )}
            {appointmentBlock.room && (
              <DetailsBlock title="Raum:">{appointmentBlock.room}</DetailsBlock>
            )}
            <DetailsBlock title="Terminarten:" contentRole="list">
              {appointmentBlock.types?.map((appointmentType) => (
                <Typography
                  key={appointmentType}
                  level="body-md"
                  role="listitem"
                >
                  {APPOINTMENT_TYPES[appointmentType]}
                </Typography>
              ))}
            </DetailsBlock>

            <DetailsBlock title="Termine:">
              {appointmentBlock.bookedAppointments?.length &&
              appointmentBlock.bookedAppointments.length > 0 ? (
                <BookedAppointmentsCount
                  count={appointmentBlock.bookedAppointments.length}
                />
              ) : (
                <Typography level="body-md">Keine gebuchten Termine</Typography>
              )}
            </DetailsBlock>

            {appointmentBlock.parallelExaminations && (
              <DetailsBlock title="Parallele Untersuchungen:">
                <ParallelExaminationsCount
                  bookedAppointments={appointmentBlock.bookedAppointments ?? []}
                  parallelExaminations={appointmentBlock.parallelExaminations}
                />
              </DetailsBlock>
            )}

            {(appointmentBlock.availableForCitizen === true ||
              appointmentBlock.availableForBulkBooking === true) && (
              <DetailsBlock title="Verfügbar für:">
                {appointmentBlock.availableForCitizen && (
                  <Typography> Online-Portal</Typography>
                )}
                {appointmentBlock.availableForBulkBooking && (
                  <Typography> Massenterminvergabe </Typography>
                )}
              </DetailsBlock>
            )}

            {usersData.creator?.name && (
              <DetailsBlock title="Ersteller/Erstellerin:">
                <Typography>{usersData.creator.name}</Typography>
              </DetailsBlock>
            )}
          </Stack>

          {props.isLimitedView && (
            <Alert
              color="primary"
              title="Hilfe"
              message="Um mehr Details einzusehen, wechseln Sie bitte zur Tagesansicht."
            />
          )}
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          left={
            <Button variant="plain" onClick={() => onClose()}>
              Abbrechen
            </Button>
          }
          right={
            <>
              {canDeleteAppointmentBlock && (
                <Button
                  variant="soft"
                  color="danger"
                  onClick={deleteAppointmentBlockWithConfirmation}
                >
                  Löschen
                </Button>
              )}
              <Button onClick={props.onUpdate}> Bearbeiten</Button>
            </>
          }
        />
      </SidebarActions>
    </>
  );
}

function BookedAppointmentsCount(props: { count: number }) {
  const message = props.count === 1 ? "gebuchter Termin" : "gebuchte Termine";
  return (
    <Typography level="body-md">
      <Typography fontWeight="bold">{props.count}</Typography> {message}
    </Typography>
  );
}

function DetailsBlock(
  props: PropsWithChildren<{
    title: string;
    contentRole?: AriaRole;
  }>,
) {
  const id = useId();
  return (
    <Stack gap={2} role="listitem">
      <Typography level="title-md" id={id}>
        {props.title}
      </Typography>
      <Stack gap={1} aria-labelledby={id} role={props.contentRole}>
        {props.children}
      </Stack>
    </Stack>
  );
}

function ParallelExaminationsCount({
  bookedAppointments,
  parallelExaminations,
}: {
  bookedAppointments: Appointment[];
  parallelExaminations: number;
}) {
  const parallelBookings = calculateMaxParallelBookings(bookedAppointments);
  const examinationsMessage =
    parallelBookings === 1
      ? "parallele Untersuchung"
      : "parallele Untersuchungen";
  return (
    <Typography level="body-md">
      <Typography fontWeight="bold">{parallelExaminations}</Typography>{" "}
      {examinationsMessage}
      <br />
      {parallelBookings === 1 ? (
        "Keine Termine parallel gebucht"
      ) : (
        <>
          maximal <Typography fontWeight="bold">{parallelBookings}</Typography>{" "}
          Termine parallel gebucht
        </>
      )}
    </Typography>
  );
}

function getUsersByRolesForAppointmentBlock(
  appointmentBlock: AppointmentBlock,
) {
  const resolvedUsers = appointmentBlock.resolvedUsers;
  if (!resolvedUsers) return {};

  return {
    physicians: mapAppointmentBlockUsers(
      resolvedUsers,
      appointmentBlock.physicians,
    ),
    consultants: mapAppointmentBlockUsers(
      resolvedUsers,
      appointmentBlock.consultants,
    ),
    mfas: mapAppointmentBlockUsers(resolvedUsers, appointmentBlock.mfas),
    sopasss: mapAppointmentBlockUsers(resolvedUsers, appointmentBlock.sopasss),
    creator: appointmentBlock.creatorId
      ? {
          name: formatUserName(resolvedUsers[appointmentBlock.creatorId]),
          id: appointmentBlock.creatorId,
        }
      : { id: appointmentBlock.creatorId },
  };
}

export function mapAppointmentBlockUsers(
  resolvedUsers: Record<string, AppointmentBlockUser>,
  ids: string[] | undefined,
) {
  if (!ids?.length) return undefined;

  const users = ids.map((id) => {
    const userData = resolvedUsers[id];

    return {
      name: formatUserName(userData),
      id,
    };
  });

  return users.length > 0 ? users : undefined;
}
