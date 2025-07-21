/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Circle } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { AriaRole, PropsWithChildren, useId } from "react";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useConfirmationDialog,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { Alert, formatUserName } from "@eshg/lib-portal";
import { ApiAppointmentBlock } from "@eshg/school-entry-api";

import { useDeleteAppointmentBlock } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { useGetAppointmentBlock } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

export function useAppointmentBlockSidebar(): UseSidebarResult<AppointmentBlockSidebarProps> {
  return useSidebar({ component: AppointmentBlockSidebar });
}

interface AppointmentBlockSidebarProps extends DrawerProps {
  appointmentBlockId: string;
  refetchEvents: () => void;
  isLimitedView?: boolean;
}

function AppointmentBlockSidebar({
  appointmentBlockId,
  refetchEvents,
  isLimitedView,
  onClose,
}: AppointmentBlockSidebarProps) {
  const deleteAppointmentBlock = useDeleteAppointmentBlock();
  const appointmentBlock = useGetAppointmentBlock(appointmentBlockId);

  const hasPhysicians = appointmentBlock.physicians.length !== 0;
  const hasMfa = appointmentBlock.mfas.length !== 0;
  const canDeleteAppointmentBlock = appointmentBlock.bookedAppointments === 0;
  const formattedAppointmentDate = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "short",
  }).formatRange(appointmentBlock.start, appointmentBlock.end);

  const { openConfirmationDialog } = useConfirmationDialog();
  function deleteAppointmentBlockWithConfirmation(
    appointmentBlock: ApiAppointmentBlock,
  ) {
    openConfirmationDialog({
      title: "Terminblock löschen?",
      description: "Möchten Sie den Terminblock wirklich löschen?",
      confirmLabel: "Löschen",
      color: "danger",
      onConfirm: async () => {
        await deleteAppointmentBlock(appointmentBlock.id);
        refetchEvents();
        onClose(true);
      },
    });
  }

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
            {hasPhysicians && (
              <DetailsBlock title="Ärzte/Ärztinnen:" contentRole="list">
                {appointmentBlock.physicians.map((id) => (
                  <Typography key={id} level="body-md" role="listitem">
                    {formatUserName(appointmentBlock.resolvedUsers[id])}
                  </Typography>
                ))}
              </DetailsBlock>
            )}
            {hasMfa && (
              <DetailsBlock title="MFA:" contentRole="list">
                {appointmentBlock.mfas.map((id) => (
                  <Typography key={id} level="body-md" role="listitem">
                    {formatUserName(appointmentBlock.resolvedUsers[id])}
                  </Typography>
                ))}
              </DetailsBlock>
            )}

            <DetailsBlock title="Terminarten:" contentRole="list">
              {appointmentBlock.types.map((appointmentType) => (
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
              {appointmentBlock.bookedAppointments > 0 ? (
                <Typography level="body-md">
                  <Typography fontWeight="bold">
                    {appointmentBlock.bookedAppointments}
                  </Typography>{" "}
                  gebuchte Termine
                </Typography>
              ) : (
                <Typography level="body-md">Keine gebuchten Termine</Typography>
              )}
            </DetailsBlock>
          </Stack>

          {isLimitedView && (
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
            canDeleteAppointmentBlock ? (
              <Button
                variant="soft"
                color="danger"
                onClick={() =>
                  deleteAppointmentBlockWithConfirmation(appointmentBlock)
                }
              >
                Terminblock löschen
              </Button>
            ) : undefined
          }
        />
      </SidebarActions>
    </>
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
