/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkIconButton } from "@eshg/lib-portal/components/navigation/InternalLinkIconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { EvaluationDetailsTableRow } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableData";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { mapRawValueToTableCell } from "@/lib/businessModules/statistics/components/evaluations/details/table/mapRawValueToTableCell";

const columnHelper = createColumnHelper<EvaluationDetailsTableRow>();

export function evaluationColumns({
  flatAttributes,
  resolveProcedureId,
}: {
  flatAttributes: FlatAttribute[];
  resolveProcedureId: (
    procedureReferenceId: string | undefined,
  ) => string | undefined;
}) {
  const dataColumns = flatAttributes
    .filter((attribute) => attribute.type !== "ProcedureReferenceAttribute")
    .map((attribute) => {
      return columnHelper.accessor(attribute.key, {
        header: attribute.name,
        cell: (props) =>
          mapRawValueToTableCell(
            props.getValue(),
            attribute.type,
            "valueOptions" in attribute ? attribute.valueOptions : undefined,
          ),
        meta: {
          width: "12rem",
        },
      });
    });

  const procedureLinkColumns = flatAttributes
    .filter((attribute) => attribute.type === "ProcedureReferenceAttribute")
    .map((attribute) => {
      return columnHelper.accessor(attribute.key, {
        header: "",
        cell: (props) => {
          const procedureReferenceId = props.getValue() as string | undefined;
          const procedureId = resolveProcedureId(procedureReferenceId);
          const href = isDefined(procedureId)
            ? resolveProcedureDetailsRoute({
                businessModule: attribute.businessModule,
                procedureId,
              })
            : undefined;

          return isDefined(href) ? (
            <Stack direction="row" justifyContent={"flex-end"}>
              <InternalLinkIconButton
                variant="plain"
                color="primary"
                size="sm"
                href={href}
                aria-label="Vorgangsdetails"
              >
                <ArrowForwardIosIcon />
              </InternalLinkIconButton>
            </Stack>
          ) : undefined;
        },
        enableSorting: false,
        meta: {
          width: "3rem",
          cellStyle: "button",
        },
      });
    });

  return [...dataColumns, ...procedureLinkColumns];
}
