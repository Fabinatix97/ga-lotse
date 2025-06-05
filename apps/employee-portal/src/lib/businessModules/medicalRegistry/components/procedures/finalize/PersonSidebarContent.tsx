/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { SidebarContent, formatList } from "@eshg/lib-employee-portal";
import { RadioGroupField, formatDate } from "@eshg/lib-portal";
import { ApiGetProcedureDraftResponse } from "@eshg/medical-registry-api";

import { DraftConfirmInfo } from "@/lib/businessModules/medicalRegistry/api/model/confirmInfo";
import {
  FORM_OPTION_NEW,
  FORM_OPTION_NO_MATCH,
} from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/FinalizeDraftSidebar";
import { SelectCard } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/SelectCard";
import { mapToOptionalPhoneNumbers } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/helper";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";

interface PersonSidebarContentProps {
  fieldName: string;
  procedure: ApiGetProcedureDraftResponse;
  persons: DraftConfirmInfo["persons"];
  showNoMatchOption: boolean;
}

export function PersonSidebarContent({
  fieldName,
  procedure,
  persons,
  showNoMatchOption,
}: PersonSidebarContentProps) {
  const { applicant } = procedure;
  const name = formatList([applicant.lastName, applicant.firstName], ", ");
  const dateOfBirth = formatDate(applicant.dateOfBirth);
  const formattedProfessional = formatList([name, dateOfBirth], ", ");

  return (
    <SidebarContent title="Eintrag anlegen" subtitle="Angaben zur Person">
      <Stack spacing={2}>
        <Typography level="body-md">
          Bitte überprüfen Sie, ob die Angaben zur Person{" "}
          <Typography fontWeight="bold">„{formattedProfessional}”</Typography>{" "}
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
              title={
                formatList([person.lastName, person.firstName], ", ") ?? ""
              }
              texts={[
                `Geb.: ${person.dateOfBirth ? formatDate(person.dateOfBirth) : "-"}`,
                `Adresse: ${fullAddress(person.contactAddress) ?? "-"}`,
                ...mapToOptionalPhoneNumbers(person.phoneNumbers).map(
                  (phoneNumber) => `Tel.: ${phoneNumber}`,
                ),
              ]}
            />
          ))}
          {showNoMatchOption ? (
            <SelectCard
              value={FORM_OPTION_NO_MATCH}
              title="Keine Übereinstimmung"
            />
          ) : (
            <SelectCard value={FORM_OPTION_NEW} title="Person neu anlegen" />
          )}
        </RadioGroupField>
      </Stack>
    </SidebarContent>
  );
}
