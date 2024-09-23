/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateAppointmentsBulkResponse } from "@eshg/employee-portal-api/schoolEntry";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import {
  CalendarMonthOutlined,
  SubdirectoryArrowRightOutlined,
} from "@mui/icons-material";
import { Button, Divider, Sheet, Stack, Typography, styled } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";

import { useCreateAppointmentsInBulk } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { mapToRowIds } from "@/lib/shared/hooks/table/useRowSelection";

const StyledSheet = styled(Sheet)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 0,
  height: 40,
}));

interface ProcedureTableTitleProps {
  rowSelection: RowSelectionState;
}

function createdMessage(numCreated: number) {
  const message =
    numCreated === 1
      ? `Es wurde ${numCreated} Termin vergeben.`
      : `Es wurden ${numCreated} Termine vergeben.`;
  return <p>{message}</p>;
}

function unmodifiedMessage(numUnmodified: number) {
  if (numUnmodified === 0) {
    return "";
  }
  const message =
    numUnmodified === 1
      ? `${numUnmodified} Vorgang hatte bereits einen Termin.`
      : `${numUnmodified} Vorgänge hatten bereits Termine.`;

  return <p>{message}</p>;
}

function errorMessage(numError: number) {
  if (numError === 0) {
    return "";
  }

  const message =
    numError === 1
      ? `Bei ${numError} Vorgang ist ein Fehler aufgetreten.`
      : `Bei ${numError} Vorgängen sind Fehler aufgetreten.`;

  return (
    <>
      <p>{message}</p>
      <p>
        Bitte stellen Sie sicher, dass ausreichend freie Termine verfügbar sind,
        die weit genug in der Zukunft liegen.
      </p>
    </>
  );
}

function useDisplayOnSuccessMessageForBulkAppointmentCreation() {
  const snackbar = useSnackbar();
  const alert = useAlertContext();

  return (response: ApiCreateAppointmentsBulkResponse) => {
    if (response.numCreated > 0) {
      if (response.numUnmodified === 0 && response.numError === 0) {
        snackbar.confirmation(createdMessage(response.numCreated));
      } else {
        alert?.setAlert({
          title: "Terminzuweisung teilweise fehlgeschlagen",
          message: (
            <>
              {createdMessage(response.numCreated)}
              {unmodifiedMessage(response.numUnmodified)}
              {errorMessage(response.numError)}
            </>
          ),
          color: "warning",
        });
      }
    } else {
      alert?.setAlert({
        title: "Es konnten keine Termine vergeben werden.",
        message: (
          <>
            {unmodifiedMessage(response.numUnmodified)}
            {errorMessage(response.numError)}
          </>
        ),
        color: "danger",
      });
    }
  };
}

export function ProceduresTableTitle(props: ProcedureTableTitleProps) {
  const createAppointmentsInBulk = useCreateAppointmentsInBulk();
  const selectedProcedureIds = mapToRowIds(props.rowSelection);
  const displayOnSuccessMessageForBulkAppointmentCreation =
    useDisplayOnSuccessMessageForBulkAppointmentCreation();

  async function handleClickBulkAppointmentButton() {
    await createAppointmentsInBulk
      .mutateAsync(
        {
          procedureIds: selectedProcedureIds,
        },
        { onSuccess: displayOnSuccessMessageForBulkAppointmentCreation },
      )
      .catch();
  }

  return (
    <StyledSheet variant="soft">
      <Stack direction="row" gap={2} alignItems="center">
        <SubdirectoryArrowRightOutlined
          sx={{ transform: "rotate(90deg)", fontSize: "1.25rem" }}
        />
        <Typography level="body-sm" data-testid="proceduresIndicator">
          <Typography fontWeight="bold">
            {selectedProcedureIds.length}
          </Typography>{" "}
          {selectedProcedureIds.length === 1 ? "Vorgang" : "Vorgänge"}{" "}
          ausgewählt
        </Typography>
        {selectedProcedureIds.length > 0 && (
          <>
            <Divider orientation="vertical" sx={{ marginY: 1 }} />
            <Button
              startDecorator={<CalendarMonthOutlined />}
              variant="plain"
              color="neutral"
              size="sm"
              loading={createAppointmentsInBulk.isPending}
              loadingPosition="start"
              disabled={createAppointmentsInBulk.isPending}
              onClick={handleClickBulkAppointmentButton}
            >
              Termin zuweisen
            </Button>
          </>
        )}
      </Stack>
    </StyledSheet>
  );
}
