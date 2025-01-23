/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import { ApiMedicalRegistryEntrySearchResult } from "@eshg/employee-portal-api/medicalRegistry";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack, Typography } from "@mui/joy";

import {
  FORM_OPTION_NEW,
  FORM_OPTION_NO_MATCH,
} from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/FinalizeDraftSidebar";
import { SelectCard } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/SelectCard";
import { procedureStatusNames } from "@/lib/shared/components/procedures/constants";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";

interface ProcedureSidebarContentProps {
  fieldName: string;
  person: ApiGetReferencePersonResponse;
  procedures: ApiMedicalRegistryEntrySearchResult[];
  showNoMatchOption: boolean;
}

export function ProcedureSidebarContent({
  fieldName,
  person,
  procedures,
  showNoMatchOption,
}: ProcedureSidebarContentProps) {
  const address = fullAddress(person?.contactAddress);

  return (
    <SidebarContent title="Eintrag anlegen" subtitle="Einträge aktualisieren">
      <Stack spacing={2}>
        <Stack>
          <Typography fontWeight="bold">{formatPersonName(person)}</Typography>
          {isNonEmptyString(address) && (
            <Typography fontWeight="bold">{address}</Typography>
          )}
          <Typography fontWeight="bold">
            Geburtsdatum:{" "}
            {person.dateOfBirth ? formatDate(person.dateOfBirth) : "-"}
          </Typography>
        </Stack>
        <Alert
          color="primary"
          message={
            <>
              Zu dieser Person existieren Einträge in der Berufskartei. Wählen
              Sie den Eintrag aus, den Sie aktualisieren möchten oder legen Sie
              den Datensatz als neuen Eintrag an.
            </>
          }
        />
        <RadioGroupField
          name={fieldName}
          required="Bitte eine Auswahl treffen."
        >
          {procedures.map((procedure) => (
            <SelectCard
              key={procedure.id}
              value={procedure.id}
              title={`Eintrag vom ${formatDate(procedure.created)} aktualisieren`}
              texts={[
                `Letze Änderung: ${formatDateTime(procedure.modifiedAt)}`,
                `Eintrag-Status: ${procedureStatusNames[procedure.status]}`,
                ...procedure.practiceNames.map(
                  (practiceName) => `Zugehörige Einrichtung: ${practiceName}`,
                ),
              ]}
            />
          ))}
          {showNoMatchOption ? (
            <SelectCard
              value={FORM_OPTION_NO_MATCH}
              title="Keinen Eintrag aktualisieren"
            />
          ) : (
            <SelectCard
              value={FORM_OPTION_NEW}
              title="Als neuen Eintrag anlegen"
            />
          )}
        </RadioGroupField>
      </Stack>
    </SidebarContent>
  );
}
