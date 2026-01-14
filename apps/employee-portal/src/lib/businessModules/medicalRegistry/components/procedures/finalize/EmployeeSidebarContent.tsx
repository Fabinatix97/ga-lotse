/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { SidebarContent } from "@eshg/lib-employee-portal";
import { RadioGroupField, formatDate, formatList } from "@eshg/lib-portal";
import { ApiEmployeeChangeType } from "@eshg/medical-registry-api";

import {
  EmployeeChoice,
  PersonCandidate,
} from "@/lib/businessModules/medicalRegistry/api/model/confirmInfo";
import { EmployeeChangeTypeChip } from "@/lib/businessModules/medicalRegistry/components/procedures/EmployeeChangeChip";
import { SelectCard } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/SelectCard";

interface EmployeeSidebarContentProps {
  baseFieldName: string;
  step: number;
  employeeChoices: EmployeeChoice[];
}

export function EmployeeSidebarContent({
  baseFieldName,
  step,
  employeeChoices,
}: EmployeeSidebarContentProps) {
  const employeeChoice = employeeChoices[step];
  if (!isDefined(employeeChoice)) {
    throw new Error(`Attempting to access employee choice at index ${step}`);
  }

  const { employeeChange, personCandidates } = employeeChoice;
  const name = formatList(
    [employeeChange.lastName, employeeChange.firstName],
    ", ",
  );
  const dateOfBirth = formatDate(employeeChange.dateOfBirth);
  const formattedEmployee = formatList([name, dateOfBirth], ", ");

  return (
    <SidebarContent
      title="Eintrag aktualisieren"
      subtitle="Mitarbeiter:innen Liste"
    >
      <Stack spacing={2}>
        <Stack spacing={3}>
          <Typography level="title-md" color="primary">
            Eintrag {step + 1} von {employeeChoices.length}
          </Typography>

          <Stack spacing={1}>
            <EmployeeChangeTypeChip changeType={employeeChange.changeType} />
            <Typography level="body-md">
              Überprüfen Sie, ob die Angaben zur Person{" "}
              <Typography fontWeight="bold">“{formattedEmployee}”</Typography>{" "}
              mit einem der folgenden Datensätze in den Stammdaten
              übereinstimmen.
            </Typography>
          </Stack>
        </Stack>
        <RadioGroupField
          name={`${baseFieldName}.${step}`}
          required="Bitte eine Auswahl treffen."
        >
          {personCandidates.map((candidate) => (
            <EmployeeCard
              key={candidate.entryId}
              changeType={employeeChange.changeType}
              candidate={candidate}
            />
          ))}
        </RadioGroupField>
      </Stack>
    </SidebarContent>
  );
}

function EmployeeCard({
  candidate,
  changeType,
}: {
  candidate: PersonCandidate;
  changeType: ApiEmployeeChangeType;
}) {
  if (candidate.isNoMatchChoice) {
    if (changeType === "ADD") {
      return (
        <SelectCard value={candidate.entryId} title="Person neu anlegen" />
      );
    } else {
      return (
        <SelectCard value={candidate.entryId} title="Keine Übereinstimmung" />
      );
    }
  }

  return (
    <SelectCard
      value={candidate.entryId}
      title={formatList([candidate.lastName, candidate.firstName], ", ") ?? ""}
      texts={[
        `Geb.: ${candidate.dateOfBirth ? formatDate(candidate.dateOfBirth) : "-"}`,
      ]}
    />
  );
}
