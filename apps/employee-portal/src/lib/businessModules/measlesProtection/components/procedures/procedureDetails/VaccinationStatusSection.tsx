/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { isDefined } from "remeda";

import { DetailsItem } from "@eshg/lib-employee-portal";
import { Alert, DetailsList, formatDateTime } from "@eshg/lib-portal";
import { ApiMeaslesVaccinationStatus } from "@eshg/measles-protection-api";

import { useRequestVaccinationStatusUpdate } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface VaccinationStatusProps {
  procedureId: string;
  measlesVaccinationStatus?: ApiMeaslesVaccinationStatus;
}

export function VaccinationStatusSection({
  procedureId,
  measlesVaccinationStatus,
}: Readonly<VaccinationStatusProps>) {
  const requestVaccinationStatusUpdate =
    useRequestVaccinationStatusUpdate(procedureId);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const queryKey = measlesProtectionApiQueryKey(["procedures", procedureId]);

  async function handleUpdateRequest() {
    await requestVaccinationStatusUpdate.mutateAsync(procedureId);
  }

  async function refreshPage() {
    setRefreshing(true);
    await queryClient.refetchQueries({
      queryKey,
    });
    setRefreshing(false);
  }

  const vaccinationCompleted = measlesVaccinationStatus?.vaccination?.complete;
  return (
    isDefined(measlesVaccinationStatus) && (
      <Stack rowGap={2}>
        <InfoTile
          title="Impfstatus aus der Einschulungsuntersuchung"
          name="vaccination status from school entry"
        >
          {isDefined(measlesVaccinationStatus?.lastUpdated) ? (
            <DetailsList>
              <Stack gap={1}>
                <DetailsItem
                  label="Impfstatus"
                  value={
                    isDefined(measlesVaccinationStatus.vaccination)
                      ? vaccinationCompleted === true
                        ? "Nachweis für eine vollständige Impfung liegt vor"
                        : "Es liegt kein Nachweis für eine vollständige Impfung vor"
                      : "Impfstatus unbekannt"
                  }
                />
                <DetailsItem
                  label="Stand vom"
                  value={formatDateTime(measlesVaccinationStatus.lastUpdated)}
                />
                {measlesVaccinationStatus.update === "POSSIBLE" && (
                  <Button onClick={handleUpdateRequest}>
                    Daten erneut abfragen
                  </Button>
                )}
                {measlesVaccinationStatus.update === "PENDING" &&
                  renderPendingMessage(refreshing, refreshPage)}
              </Stack>
            </DetailsList>
          ) : measlesVaccinationStatus.update === "POSSIBLE" ? (
            <Stack gap={1}>
              <Alert
                color="primary"
                message="Bitte fragen Sie zuerst ab, ob Impfdaten vorhanden sind, bevor Sie neue Daten eingeben."
              />
              <Button onClick={handleUpdateRequest}>Daten anfragen</Button>
            </Stack>
          ) : (
            measlesVaccinationStatus.update === "PENDING" &&
            renderPendingMessage(refreshing, refreshPage)
          )}
        </InfoTile>
      </Stack>
    )
  );
}

function renderPendingMessage(
  refreshing: boolean,
  refreshPage: () => Promise<void>,
) {
  return (
    <Stack gap={2}>
      <Alert
        color="warning"
        title="Update läuft"
        message="Das Update des Impfstatus kann bis zu 2 Stunden dauern."
      />
      <Button fullWidth loading={refreshing} onClick={refreshPage}>
        Seite aktualisieren
      </Button>
    </Stack>
  );
}
