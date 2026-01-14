/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip, ChipProps } from "@mui/joy";

import {
  ApiProcedureStatus,
  ApiProcedureType,
} from "@eshg/medical-registry-api";

import {
  EntryStatus,
  entryStatusNames,
} from "@/lib/businessModules/medicalRegistry/shared/constants";

interface MedicalRegistryProcedureChipProps {
  status: ApiProcedureStatus;
  type: ApiProcedureType;
  "aria-label"?: ChipProps["aria-label"];
}

export function MedicalRegistryProcedureChip({
  status,
  type,
  ...props
}: MedicalRegistryProcedureChipProps) {
  if (status === ApiProcedureStatus.Closed) {
    return (
      <Chip {...props} color="success">
        {entryStatusNames[EntryStatus.Closed]}
      </Chip>
    );
  }
  if (type === "MEDICAL_REGISTRY_ENTRY") {
    return (
      <Chip {...props} color="neutral">
        {entryStatusNames[EntryStatus.Open]}
      </Chip>
    );
  }
  if (type === "MEDICAL_REGISTRY_CITIZEN_DRAFT") {
    return (
      <Chip {...props} color="danger">
        {entryStatusNames[EntryStatus.DraftCitizen]}
      </Chip>
    );
  }
  if (type === "MEDICAL_REGISTRY_EMPLOYEE_DRAFT") {
    return (
      <Chip {...props} color="warning">
        {entryStatusNames[EntryStatus.DraftEmployee]}
      </Chip>
    );
  }

  return null;
}
