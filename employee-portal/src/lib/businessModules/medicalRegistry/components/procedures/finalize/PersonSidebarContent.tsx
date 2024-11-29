/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedureDraftResponse } from "@eshg/employee-portal-api/medicalRegistry";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Stack, Typography } from "@mui/joy";

import { SearchDraftReferencesResponse } from "@/lib/businessModules/medicalRegistry/api/queries/draft";
import { FORM_OPTION_NEW } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/FinalizeDraftSidebar";
import { SelectCard } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/SelectCard";
import { mapToOptionalPhoneNumbers } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/helper";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";
import { join } from "@/lib/shared/helpers/strings";

interface PersonSidebarContentProps {
  fieldName: string;
  procedure: ApiGetProcedureDraftResponse;
  persons: SearchDraftReferencesResponse["persons"];
}

export function PersonSidebarContent({
  fieldName,
  procedure,
  persons,
}: PersonSidebarContentProps) {
  const { applicant } = procedure;
  const name = join([applicant.lastName, applicant.firstName], ", ");
  const dateOfBirth = formatDate(applicant.dateOfBirth);
  const formattedProfessional = join([name, dateOfBirth], ", ");

  return (
    <SidebarContent title="Eintrag anlegen" subtitle="Angaben zur Person">
      <Stack spacing={2}>
        <Typography level="body-md">
          Bitte überprüfen Sie, ob die Angaben zur Person{" "}
          <Typography fontWeight="bold">“{formattedProfessional}”</Typography>{" "}
          mit einem der folgenden Datensätze in den Stammdaten übereinstimmen
          oder legen Sie die Person mit Daten aus dem Formular neu an.
        </Typography>
        <RadioGroupField
          name={fieldName}
          required="Bitte eine Auswahl treffen."
        >
          {persons.map((person) => (
            <SelectCard
              key={person.id}
              value={person.id}
              title={join([person.lastName, person.firstName], ", ") ?? ""}
              texts={[
                `Geb.: ${person.dateOfBirth ? formatDate(person.dateOfBirth) : "-"}`,
                `Adresse: ${fullAddress(person.contactAddress) ?? "-"}`,
                ...mapToOptionalPhoneNumbers(person.phoneNumbers).map(
                  (phoneNumber) => `Tel.: ${phoneNumber}`,
                ),
              ]}
            />
          ))}
          <SelectCard value={FORM_OPTION_NEW} title="Person neu anlegen" />
        </RadioGroupField>
      </Stack>
    </SidebarContent>
  );
}
