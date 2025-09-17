/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";
import { ReactNode, TdHTMLAttributes } from "react";

import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import { isInUpperJaw } from "../../stores/examination/actions/utils";
import {
  Quadrant,
  QuadrantNumber,
  Tooth,
  ToothContext,
  ToothElement,
  hasPreviousExaminationResult,
} from "../../stores/examination/types";

import { ToothNumber } from "./ToothNumber";
import { SR_ONLY_STYLES } from "./styles";
import { ToothButton } from "./toothIconButtons";
import {
  MainResultField,
  PreviousResultsList,
  SecondaryResultField,
} from "./toothResults";

interface Row {
  type: RowType;
  header: string;
  appearance?: RowAppearance;
  isColumnHeader?: boolean;
}

type RowType = ToothElement | "toothNumber" | "previousResults";
type RowAppearance = "sr-only" | "aria-hidden";

type CellRenderer = (props: CellRendererProps) => ReactNode;

interface CellRendererProps {
  tooth: Tooth;
  toothContext: ToothContext;
  gridContext: GridContext;
  quadrant: Quadrant;
}

export interface GridContext {
  columnIndex: number;
  rowIndex: number;
}

const ROWS: Row[] = [
  { type: "toothNumber", header: "Zahnnummer", isColumnHeader: true },
  { type: "toothButton", header: "Zahntyp" },
  { type: "mainResultField", header: "Hauptbefund" },
  { type: "secondaryResultField", header: "Nebenbefund" },
  { type: "previousResults", header: "Vorbefunde" },
];

const MIRRORED_ROWS: Row[] = [
  {
    type: "toothNumber",
    header: "Zahnnummer",
    isColumnHeader: true,
    appearance: "sr-only",
  },
  { type: "previousResults", header: "Vorbefunde" },
  { type: "secondaryResultField", header: "Nebenbefund" },
  { type: "mainResultField", header: "Hauptbefund" },
  { type: "toothButton", header: "Zahntyp" },
  { type: "toothNumber", header: "Zahnnummer", appearance: "aria-hidden" },
];

const CELL_RENDERER: Record<RowType, CellRenderer> = {
  toothNumber: ({ tooth, gridContext, quadrant }) => (
    <ToothNumber
      id={columnHeaderId(quadrant.quadrantNumber, gridContext.columnIndex)}
      tooth={tooth}
    />
  ),
  toothButton: ({ tooth, toothContext }) => (
    <ToothButton tooth={tooth} toothContext={toothContext} />
  ),
  mainResultField: ({ tooth, toothContext, gridContext, quadrant }) => (
    <MainResultField
      tooth={tooth}
      toothContext={toothContext}
      isTabFocusable={tooth.toothNumber === quadrant.tabTarget}
      aria-labelledby={inputLabelledByIds(quadrant.quadrantNumber, gridContext)}
    />
  ),
  secondaryResultField: ({ tooth, toothContext, gridContext, quadrant }) => (
    <SecondaryResultField
      tooth={tooth}
      toothContext={toothContext}
      aria-labelledby={inputLabelledByIds(quadrant.quadrantNumber, gridContext)}
    />
  ),
  previousResults: ({ tooth }) => <PreviousResultsList tooth={tooth} />,
};

const TableGrid = styled("table")(({ theme }) => ({
  "th, td": {
    textAlign: "center",
    padding: theme.spacing(1),
    "&.first-cell": {
      paddingLeft: 0,
    },
    "&.last-cell": {
      paddingRight: 0,
    },
  },
  ".sr-only": SR_ONLY_STYLES,
  "tr.first-row": {
    "td, th": {
      paddingTop: 0,
    },
  },
  "tr.last-row": {
    "td, th": {
      paddingBottom: 0,
    },
  },
}));

interface QuadrantFormProps {
  titleId: string;
  quadrantNumber: QuadrantNumber;
}

export function QuadrantForm(props: QuadrantFormProps) {
  const { titleId, quadrantNumber } = props;
  const quadrant = useExaminationStore(
    (state) => state.dentition[props.quadrantNumber],
  );
  const hasPreviousExaminationResults = quadrant.teeth.some(
    hasPreviousExaminationResult,
  );

  function isHiddenRow(row: Row): boolean {
    return (
      row.appearance === "sr-only" ||
      (row.type === "previousResults" && !hasPreviousExaminationResults)
    );
  }

  function isVisibleRow(row: Row): boolean {
    return !isHiddenRow(row);
  }

  const isMirrored = isInUpperJaw(quadrantNumber);
  const rows = isMirrored ? MIRRORED_ROWS : ROWS;
  const firstVisibleRowIndex = rows.findIndex(isVisibleRow);
  const lastVisibleRowIndex = rows.findLastIndex(isVisibleRow);

  return (
    <TableGrid role="grid" aria-labelledby={titleId}>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={
              isHiddenRow(row)
                ? "sr-only"
                : rowIndex === lastVisibleRowIndex
                  ? "last-row"
                  : rowIndex === firstVisibleRowIndex
                    ? "first-row"
                    : undefined
            }
            aria-hidden={row.appearance === "aria-hidden"}
          >
            <th
              id={rowHeaderId(quadrantNumber, rowIndex)}
              scope="row"
              className="sr-only"
            >
              {row.header}
            </th>
            {quadrant.teeth.map((tooth, toothIndex) => (
              <GridCell
                key={tooth.toothNumber}
                isColumnHeader={row.isColumnHeader ?? false}
                className={
                  toothIndex === 0
                    ? "first-cell"
                    : toothIndex === quadrant.teeth.length - 1
                      ? "last-cell"
                      : undefined
                }
              >
                {CELL_RENDERER[row.type]({
                  tooth,
                  toothContext: { quadrantNumber, toothIndex },
                  gridContext: { columnIndex: toothIndex, rowIndex },
                  quadrant,
                })}
              </GridCell>
            ))}
          </tr>
        ))}
      </tbody>
    </TableGrid>
  );
}

interface GridCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  isColumnHeader: boolean;
}

function GridCell(props: GridCellProps) {
  const { isColumnHeader, ...cellProps } = props;

  if (isColumnHeader) {
    return <th {...cellProps} scope="col" />;
  }

  return <td {...cellProps} />;
}

function columnHeaderId(
  quadrantNumber: QuadrantNumber,
  columnIndex: number,
): string {
  return `${quadrantNumber}-col-${columnIndex}`;
}

function rowHeaderId(quadrantNumber: QuadrantNumber, rowIndex: number): string {
  return `${quadrantNumber}-row-${rowIndex}`;
}

function inputLabelledByIds(
  quadrantNumber: QuadrantNumber,
  gridContext: GridContext,
): string {
  return `${columnHeaderId(quadrantNumber, gridContext.columnIndex)} ${rowHeaderId(quadrantNumber, gridContext.rowIndex)}`;
}
