/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiMedicalRegistryEntry,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/medicalRegistry";
import { Chip } from "@mui/joy";

interface MedicalRegistryProcedureChipProps {
  procedure: ApiMedicalRegistryEntry;
}

export function MedicalRegistryProcedureChip({
  procedure,
}: MedicalRegistryProcedureChipProps) {
  if (procedure.status === ApiProcedureStatus.Closed) {
    return <Chip color="success">Geschlossen</Chip>;
  }
  if (procedure.type === "MEDICAL_REGISTRY_ENTRY") {
    return <Chip color="neutral">Offen</Chip>;
  }
  if (procedure.type === "MEDICAL_REGISTRY_CITIZEN_DRAFT") {
    return <Chip color="danger">Externer Entwurf</Chip>;
  }
  if (procedure.type === "MEDICAL_REGISTRY_EMPLOYEE_DRAFT") {
    return <Chip color="warning">Interner Entwurf</Chip>;
  }

  return null;
}
