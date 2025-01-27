/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createColumnHelper } from "@tanstack/react-table";

import { EvaluationDetailsTableRow } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableData";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { mapRawValueToTableCell } from "@/lib/businessModules/statistics/components/evaluations/details/table/mapRawValueToTableCell";

const columnHelper = createColumnHelper<EvaluationDetailsTableRow>();
// TODO: this should be removed in ISSUE-7403
export const DUMMY_COLUMN = "dummyColumn";

export function evaluationColumns({
  flatAttributes,
}: {
  flatAttributes: FlatAttribute[];
}) {
  const canNavigate = flatAttributes.some(
    (attribute) => attribute.type === "ProcedureReferenceAttribute",
  );

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
          canNavigate: {
            parentRow: canNavigate,
          },
          width: "12rem",
        },
      });
    });

  const dummyColumn = columnHelper.accessor(DUMMY_COLUMN, {
    header: "",
    cell: "",
    meta: {
      canNavigate: {
        parentRow: canNavigate,
      },
    },
  });

  return dataColumns.length > 0 ? dataColumns : [dummyColumn];
}
