/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BorderColor,
  DeviceHub,
  InfoOutlined,
  Loop,
} from "@mui/icons-material";
import { Alert, Button, Stack, Typography } from "@mui/joy";

import { useConfirmationDialog } from "@eshg/lib-employee-portal";

interface MeasurementProgressPanelProps {
  alias: string;
  correlationId?: string;
  equipmentName?: string;
  showPendingBanner: boolean;
  getTestResults: () => void;
  stopAwaitingResult: () => void;
}

export function MeasurementProgressPanel({
  alias,
  correlationId,
  equipmentName,
  showPendingBanner,
  getTestResults,
  stopAwaitingResult,
}: MeasurementProgressPanelProps) {
  const { openConfirmationDialog } = useConfirmationDialog();

  return (
    <Stack gap={2} marginBottom={2}>
      <Alert color="primary">
        <DeviceHub sx={{ color: "primary.700" }} />
        <Stack>
          <Typography level="title-md" sx={{ color: "primary.700" }}>
            ID: {correlationId}, Alias: {alias}, Testgerät: {equipmentName}
          </Typography>
          <Typography sx={{ color: "primary.700" }}>
            Nach erfolgreicher Durchführung können die Daten der Messung
            abgerufen werden.
          </Typography>
        </Stack>
      </Alert>
      {showPendingBanner && (
        <Alert color="warning" variant="soft">
          <InfoOutlined sx={{ color: "warning.700" }} />
          <Typography sx={{ color: "warning.700" }}>
            Aktuell sind noch keine Messdaten zum Abruf vorhanden. Bitte
            probieren Sie es zu einem späteren Zeitpunkt erneut.
          </Typography>
        </Alert>
      )}
      <Stack
        justifyContent="start"
        gap={2}
        direction={{ xs: "column", sm: "row" }}
      >
        <Button startDecorator={<Loop />} onClick={getTestResults}>
          Messdaten abrufen
        </Button>
        <Button
          startDecorator={<BorderColor />}
          variant="outlined"
          onClick={() =>
            openConfirmationDialog({
              title: "Messdaten-Abruf stornieren?",
              description:
                "Wenn Sie die Daten manuell eintragen, kann der aktuelle Abruf der Messdaten über ein Messgerät nicht mehr abgefragt werden. Möchten Sie die Daten manuell eintragen?",
              confirmLabel: "Manuell eintragen",
              color: "danger",
              onConfirm: stopAwaitingResult,
            })
          }
        >
          Daten manuell eintragen
        </Button>
      </Stack>
    </Stack>
  );
}
