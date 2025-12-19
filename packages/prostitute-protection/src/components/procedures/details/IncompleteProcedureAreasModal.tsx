/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Typography } from "@mui/joy";

import { BaseModal, BaseModalProps } from "@eshg/lib-portal";
import { ApiProcedureProperty } from "@eshg/prostitute-protection-api";

import {
  REQUIRED_PROCEDURE_AREAS,
  REQUIRED_PROCEDURE_PROPERTIES,
} from "../../../shared/constants";

interface IncompleteProcedureAreasModalProps {
  incompleteProcedureAreas: Record<string, ApiProcedureProperty[]>;
}

export function IncompleteProcedureAreasModal(
  props: IncompleteProcedureAreasModalProps &
    Omit<BaseModalProps, "children" | "modalTitle">,
) {
  const { incompleteProcedureAreas, ...modalProps } = props;

  return (
    <BaseModal {...modalProps} modalTitle="Fehlende Angaben!" color="danger">
      <Typography level="body-md">
        Bitte vervollständigen Sie folgende Bereiche:
      </Typography>
      <Box overflow="auto">
        <Typography component="ul">
          {Object.entries(incompleteProcedureAreas).map(
            ([area, values]: [string, ApiProcedureProperty[]]) => (
              <li key={area}>
                <Typography fontWeight="bold">
                  {REQUIRED_PROCEDURE_AREAS[area]}
                </Typography>
                <br />
                {values
                  .map((value) => REQUIRED_PROCEDURE_PROPERTIES[value])
                  .join(", ")}
              </li>
            ),
          )}
        </Typography>
      </Box>
    </BaseModal>
  );
}
