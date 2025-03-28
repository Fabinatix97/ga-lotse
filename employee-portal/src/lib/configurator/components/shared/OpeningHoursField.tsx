/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TextareaField } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Add, Delete } from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { FieldArray, useField } from "formik";
import { ReactElement, useState } from "react";

export interface OpeningHoursFieldProps {
  name: string;
  english?: boolean;
}

export interface OpeningHoursFieldValue {
  rows: {
    weekday: string;
    timeWindow: string;
  }[];
  additionalInfo: string;
}

export function OpeningHoursField(props: OpeningHoursFieldProps) {
  const [input, _, helpers] = useField<OpeningHoursFieldValue>(props.name);
  const [amountRows, setAmountRows] = useState<number>(1);

  async function deleteRow(index: number) {
    if (amountRows === 1) {
      return;
    }

    setAmountRows(amountRows - 1);
    const newValue = {
      ...input.value,
      rows: input.value.rows.toSpliced(index, 1),
    };
    await helpers.setValue(newValue);
  }

  async function addRow() {
    const newValue = {
      ...input.value,
      rows: [...input.value.rows, { weekday: "", timeWindow: "" }],
    };
    await helpers.setValue(newValue);
    setAmountRows(amountRows + 1);
  }

  function validateField(
    maxLength: number,
    rowIndex?: number,
    isTimeWindow?: boolean,
  ) {
    const isEmpty =
      input.value.additionalInfo.trim().length === 0 &&
      input.value.rows.length ===
        input.value.rows.filter(
          (it) =>
            it.timeWindow.trim().length === 0 && it.weekday.trim().length === 0,
        ).length;
    const emptyRow =
      rowIndex !== undefined &&
      (rowIndex !== 0 || amountRows > 1) &&
      input.value.rows[rowIndex]!.weekday.trim().length === 0 &&
      input.value.rows[rowIndex]!.timeWindow.trim().length === 0;
    const emptyTimeWindow =
      rowIndex !== undefined &&
      isTimeWindow &&
      input.value.rows[rowIndex]!.weekday.trim().length > 0 &&
      input.value.rows[rowIndex]!.timeWindow.trim().length === 0;
    return (currentValue: string) => {
      if (currentValue?.length > maxLength) {
        return `Maximal ${maxLength} Zeichen`;
      }
      if (!props.english) {
        if (isEmpty) {
          return "Mind. eine Zeile oder Zusatzinformationen ausfüllen";
        }
        if (emptyRow) {
          return "Die Zeile muss ausgefüllt sein";
        }
      }
      if (emptyTimeWindow) {
        return "Das Zeitfenster muss ausgefüllt sein";
      }
      return undefined;
    };
  }

  const rows: ReactElement[] = [];
  for (let i = 0; i < amountRows; ++i) {
    rows.push(
      <Stack gap={0.5} key={`row-${amountRows}-${i + 1}`}>
        <Typography level="title-md">{`Zeile ${i + 1}`}</Typography>
        <Stack direction="row" gap={3}>
          <InputField
            sx={{
              flex: 0.5,
            }}
            type="text"
            name={`${props.name}.rows.${i}.weekday`}
            label="Wochentag"
            placeholder={props.english ? "e.g. Monday" : "z.B. Montag"}
            validate={validateField(15, i)}
          />
          <InputField
            sx={{
              flex: 1,
            }}
            type="text"
            name={`${props.name}.rows.${i}.timeWindow`}
            label="Zeitfenster"
            placeholder={
              props.english
                ? "e.g. 08:00 am to 12:00 pm"
                : "z.B. 08:00 Uhr bis 12:00 Uhr"
            }
            validate={validateField(100, i, true)}
          />
          {amountRows > 1 && (
            <IconButton
              color="danger"
              variant="outlined"
              onClick={() => deleteRow(i)}
              sx={{ marginTop: "auto" }}
            >
              <Delete />
            </IconButton>
          )}
        </Stack>
      </Stack>,
    );
  }

  return (
    <Stack gap={3} flex={1}>
      <FieldArray
        name={`${props.name}.rows`}
        render={() => (
          <Stack gap={3}>
            {rows}
            <Button
              color="primary"
              variant="plain"
              onClick={addRow}
              sx={{
                alignSelf: "flex-start",
              }}
              startDecorator={<Add />}
            >
              Weitere Zeile
            </Button>
          </Stack>
        )}
      />
      <Divider />
      <TextareaField
        label="Zusatzinformationen"
        placeholder={
          props.english
            ? "e.g. by appointment only; Thursdays only during the Hessian school vacations"
            : "z.B. Nur nach Terminabsprache; donnerstags nur in den hessischen Schulferien"
        }
        name={`${props.name}.additionalInfo`}
        validate={validateField(150)}
      />
    </Stack>
  );
}
