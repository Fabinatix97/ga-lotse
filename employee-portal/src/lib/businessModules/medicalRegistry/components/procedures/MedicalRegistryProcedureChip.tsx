/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiProcedureStatus,
  ApiProcedureType,
} from "@eshg/employee-portal-api/medicalRegistry";
import { Chip, ChipProps } from "@mui/joy";

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
        Geschlossen
      </Chip>
    );
  }
  if (type === "MEDICAL_REGISTRY_ENTRY") {
    return (
      <Chip {...props} color="neutral">
        Offen
      </Chip>
    );
  }
  if (type === "MEDICAL_REGISTRY_CITIZEN_DRAFT") {
    return (
      <Chip {...props} color="danger">
        Externer Entwurf
      </Chip>
    );
  }
  if (type === "MEDICAL_REGISTRY_EMPLOYEE_DRAFT") {
    return (
      <Chip {...props} color="warning">
        Interner Entwurf
      </Chip>
    );
  }

  return null;
}
