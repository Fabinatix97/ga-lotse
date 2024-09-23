/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiRequiredProcedureData } from "@eshg/employee-portal-api/schoolEntry";
import { Typography } from "@mui/joy";

import { REQUIRED_PROCEDURE_DATA } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { BaseModal, BaseModalProps } from "@/lib/shared/components/BaseModal";

interface IncompleteAreasModalProps {
  requiredProcedureData: ApiRequiredProcedureData[];
}

export function RequiredProcedureDataDialog(
  props: IncompleteAreasModalProps &
    Omit<BaseModalProps, "children" | "modalTitle">,
) {
  return (
    <BaseModal {...props}>
      <Typography level="h3" color="danger">
        Fehlende Angaben!
      </Typography>
      <Typography level="body-md">
        Bitte vervollständigen Sie folgende Bereiche:
      </Typography>
      <Typography component="ul" fontWeight="bold">
        {props.requiredProcedureData.map((area) => (
          <li key={area}>{REQUIRED_PROCEDURE_DATA[area]}</li>
        ))}
      </Typography>
    </BaseModal>
  );
}
