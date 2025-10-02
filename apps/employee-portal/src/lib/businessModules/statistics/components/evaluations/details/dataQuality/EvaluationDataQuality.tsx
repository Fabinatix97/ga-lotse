/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DiamondOutlined,
  IndeterminateCheckBoxOutlined,
  MoodBadOutlined,
  QuestionMarkOutlined,
  SummarizeOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable, TablePage, TableSheet } from "@eshg/lib-employee-portal";
import {
  ApiGetCompletenessDataResponse,
  ApiGetCompletenessDataResponseCompletenessOfAttributesInner,
} from "@eshg/statistics-api";

import { FlashCard } from "@/lib/shared/components/cards/FlashCard";

const columnHelper =
  createColumnHelper<ApiGetCompletenessDataResponseCompletenessOfAttributesInner>();

function mapMandatory(mandatory: boolean) {
  return mandatory ? "Pflichtfeld" : "Optional";
}

const columns = [
  columnHelper.display({
    header: "Attribut",
    cell: (props) => {
      return props.row.original.type === "CompletenessOfBaseAttribute"
        ? `${props.row.original.businessAttributeName}: ${props.row.original.baseAttributeName}`
        : props.row.original.name;
    },
    meta: {
      width: "16rem",
    },
  }),
  columnHelper.accessor("mandatory", {
    header: "Verpflichtungsgrad",
    cell: (props) => mapMandatory(props.getValue()),
    meta: {
      width: "12rem",
    },
  }),
  columnHelper.accessor("percentNull", {
    header: "Leere Felder",
    cell: (props) => `${props.getValue()} %`,
    meta: {
      width: "9rem",
    },
  }),
  columnHelper.accessor("unknownValue", {
    header: "Unbekannter Wert",
    cell: (props) => props.getValue(),
    meta: {
      width: "12rem",
    },
  }),
  columnHelper.accessor("percentUnknown", {
    header: "Häufigkeit",
    cell: (props) =>
      props.getValue() === undefined ? null : `${props.getValue()} %`,
    meta: {
      width: "9rem",
    },
  }),
  columnHelper.accessor("percentSum", {
    header: "Gesamt",
    cell: (props) => `${props.getValue()} %`,
    meta: {
      width: "9rem",
    },
  }),
];

export function EvaluationDataQuality(data: ApiGetCompletenessDataResponse) {
  const totalAttributesCount = data.completenessOfAttributes.length;

  return (
    <Stack gap={3}>
      <DataQualityCards
        totalAttributesCount={totalAttributesCount}
        data={data.completenessOfAttributes}
      />
      <TablePage data-testid="evaluation-data-quality-table">
        <TableSheet>
          <DataTable
            wrapContent
            columns={columns}
            data={data.completenessOfAttributes}
          />
        </TableSheet>
      </TablePage>
    </Stack>
  );
}

function DataQualityCards(props: {
  totalAttributesCount: number;
  data: ApiGetCompletenessDataResponseCompletenessOfAttributesInner[];
}) {
  function sumPercentages(
    data: ApiGetCompletenessDataResponseCompletenessOfAttributesInner[],
    property: "percentNull" | "percentUnknown",
  ) {
    return data.reduce((sum, attribute) => sum + (attribute[property] ?? 0), 0);
  }

  const emptyFieldsMean =
    sumPercentages(props.data, "percentNull") / props.totalAttributesCount;

  const unknownValuesMean =
    sumPercentages(props.data, "percentUnknown") / props.totalAttributesCount;

  return (
    <Stack
      component="dl"
      margin="0"
      direction={{ xxs: "column", sm: "row" }}
      flexWrap={{ xxs: "wrap", sm: "nowrap" }}
      gap={2}
    >
      <FlashCard
        color="primary"
        title="Anzahl der Attribute"
        figure={`${props.totalAttributesCount}`}
        icon={<SummarizeOutlined sx={{ fontSize: "l" }} />}
      />
      <FlashCard
        color="primary"
        title="Anteil leere Felder"
        figure={`${emptyFieldsMean.toFixed(2)} %`}
        icon={<IndeterminateCheckBoxOutlined sx={{ fontSize: "l" }} />}
      />
      <FlashCard
        color="primary"
        title="Anteil unbekannte Werte"
        figure={`${unknownValuesMean.toFixed(2)} %`}
        icon={<QuestionMarkOutlined sx={{ fontSize: "l" }} />}
      />
      <FlashCard
        color="danger"
        title="Häufigkeit gesamt"
        figure={`${(emptyFieldsMean + unknownValuesMean).toFixed(2)} %`}
        icon={<MoodBadOutlined sx={{ fontSize: "l" }} />}
      />
      <FlashCard
        color="success"
        title="Datenqualität"
        figure={`${(100 - emptyFieldsMean - unknownValuesMean).toFixed(2)} %`}
        icon={<DiamondOutlined sx={{ fontSize: "l" }} />}
      />
    </Stack>
  );
}
