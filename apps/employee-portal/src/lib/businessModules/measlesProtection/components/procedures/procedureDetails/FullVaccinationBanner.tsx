/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert, Button } from "@mui/joy";
import { isDefined } from "remeda";

import { ApiMeaslesProtectionProcedure } from "@eshg/measles-protection-api";

import { useCloseVaccinated } from "@/lib/businessModules/measlesProtection/api/mutations/statusTransitionApi";

export function FullVaccinationBanner({
  procedure,
}: Readonly<{
  procedure: ApiMeaslesProtectionProcedure;
}>) {
  const closeVaccinated = useCloseVaccinated();
  const isVaccinated =
    procedure.measlesVaccinationStatusFromSchoolEntry?.vaccination?.complete;
  async function handleCloseVaccinated() {
    await closeVaccinated.mutateAsync(procedure.id);
  }
  if (isDefined(isVaccinated) && isVaccinated && procedure.isOpen) {
    return (
      <Alert
        color="warning"
        size="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span>
          Für diese Person liegt durch die Schuleingangsuntersuchung ein
          vollständiger Nachweis für eine vollständige Impfung vor.
          <br />
          Möchten Sie den Vorgang jetzt schließen?
        </span>
        <Button variant="solid" color="primary" onClick={handleCloseVaccinated}>
          Ja, Vorgang schließen
        </Button>
      </Alert>
    );
  }
}
