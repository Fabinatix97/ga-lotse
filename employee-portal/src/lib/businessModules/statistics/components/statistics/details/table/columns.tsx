/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkIconButton } from "@eshg/lib-portal/components/navigation/InternalLinkIconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { StatisticDetailsTableRow } from "@/lib/businessModules/statistics/api/models/statisticDetailsTableData";
import { mapRawValueToTableCell } from "@/lib/businessModules/statistics/components/statistics/details/table/mapRawValueToTableCell";

const columnHelper = createColumnHelper<StatisticDetailsTableRow>();

export function statisticsColumns(flatAttributes: FlatAttribute[]) {
  const dataColumns = flatAttributes
    .filter((attribute) => attribute.type !== "ProcedureIdAttribute")
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
    .filter((attribute) => attribute.type === "ProcedureIdAttribute")
    .map((attribute) => {
      return columnHelper.accessor(attribute.key, {
        header: "",
        cell: (props) => {
          return (
            <Stack direction="row" justifyContent={"flex-end"}>
              <InternalLinkIconButton
                variant="plain"
                color="primary"
                size="sm"
                href={resolveProcedureDetailsRoute({
                  businessModule: attribute.businessModule,
                  procedureId: props.getValue() as string,
                })}
                aria-label="Vorgangsdetails"
              >
                <ArrowForwardIosIcon />
              </InternalLinkIconButton>
            </Stack>
          );
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
