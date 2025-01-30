/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import { ApiRequiredProcedureArea } from "@eshg/school-entry-api";
import { Typography } from "@mui/joy";

import { REQUIRED_PROCEDURE_AREAS } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface IncompleteProcedureAreasModalProps {
  incompleteProcedureAreas: ApiRequiredProcedureArea[];
}

export function IncompleteProcedureAreasModal(
  props: IncompleteProcedureAreasModalProps &
    Omit<BaseModalProps, "children" | "modalTitle">,
) {
  return (
    <BaseModal {...props} modalTitle="Fehlende Angaben!" color="danger">
      <Typography level="body-md">
        Bitte vervollständigen Sie folgende Bereiche:
      </Typography>
      <Typography component="ul" fontWeight="bold">
        {props.incompleteProcedureAreas.map((area) => (
          <li key={area}>{REQUIRED_PROCEDURE_AREAS[area]}</li>
        ))}
      </Typography>
    </BaseModal>
  );
}
