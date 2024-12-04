/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedureDraftResponse } from "@eshg/employee-portal-api/medicalRegistry";
import { Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { SearchDraftReferencesResponse } from "@/lib/businessModules/medicalRegistry/api/queries/draft";
import { FORM_OPTION_NEW } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/FinalizeDraftSidebar";
import { SelectCard } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/SelectCard";
import { mapToOptionalPhoneNumbers } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/helper";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";

interface FacilitySidebarContentProps {
  fieldName: string;
  procedure: ApiGetProcedureDraftResponse;
  facilities: SearchDraftReferencesResponse["facilities"];
}

export function FacilitySidebarContent({
  fieldName,
  procedure,
  facilities,
}: FacilitySidebarContentProps) {
  const practiceName = procedure.practices?.[0]?.name;

  return (
    <SidebarContent title="Eintrag anlegen" subtitle="Angaben zur Einrichtung">
      <Stack spacing={2}>
        <Typography level="body-md">
          Bitte überprüfen Sie, ob die Angaben zur Einrichtung{" "}
          {isDefined(practiceName) && (
            <Typography fontWeight="bold">„{practiceName}”</Typography>
          )}{" "}
          mit einem der folgenden Datensätze in den Stammdaten übereinstimmen
          oder legen Sie die Einrichtung mit Daten aus dem Formular neu an.
        </Typography>
        <RadioGroupField
          name={fieldName}
          required="Bitte eine Auswahl treffen."
        >
          {facilities.map((facility) => (
            <SelectCard
              key={facility.id}
              value={facility.id}
              title={facility.name}
              texts={[
                `Adresse: ${fullAddress(facility.contactAddress) ?? "-"}`,
                ...mapToOptionalPhoneNumbers(facility.phoneNumbers).map(
                  (phoneNumber) => `Tel.: ${phoneNumber}`,
                ),
              ]}
            />
          ))}
          <SelectCard value={FORM_OPTION_NEW} title="Einrichtung neu anlegen" />
        </RadioGroupField>
      </Stack>
    </SidebarContent>
  );
}
