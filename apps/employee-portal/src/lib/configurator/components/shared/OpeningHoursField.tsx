/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, Delete } from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { useField } from "formik";
import { ReactElement } from "react";

import {
  FieldArrayWithFocus,
  InputField,
  TextareaField,
} from "@eshg/lib-portal";

interface OpeningHoursFieldProps {
  name: string;
  required?: boolean;
}

export interface OpeningHoursFieldValue {
  rows: {
    weekday: string;
    timeWindow: string;
  }[];
  additionalInfo: string;
}

export function OpeningHoursField(props: OpeningHoursFieldProps) {
  const [input, _] = useField<OpeningHoursFieldValue>(props.name);
  const amountRows = input.value.rows.length || 1;

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
      if (isEmpty && props.required) {
        return "Mind. eine Zeile oder Zusatzinformationen ausfüllen";
      }
      if (emptyRow) {
        return "Die Zeile muss ausgefüllt sein";
      }
      if (emptyTimeWindow) {
        return "Das Zeitfenster muss ausgefüllt sein";
      }
      return undefined;
    };
  }

  function createRows(
    remove: (index: number) => void,
    setInputElementRef: (ref: HTMLElement, index: number) => void,
  ) {
    const rows: ReactElement[] = [];
    for (let i = 0; i < amountRows; ++i) {
      rows.push(
        <Stack key={`row-${amountRows}-${i + 1}`} gap={0.5}>
          <Typography level="title-md">{`Zeile ${i + 1}`}</Typography>
          <Stack direction="row" gap={3}>
            <InputField
              ref={(el) => {
                setInputElementRef(el, i);
              }}
              sx={{
                flex: 0.5,
              }}
              type="text"
              name={`${props.name}.rows.${i}.weekday`}
              label="Wochentag"
              placeholder="z.B. Montag"
              validate={validateField(75, i)}
            />
            <InputField
              sx={{
                flex: 1,
              }}
              type="text"
              name={`${props.name}.rows.${i}.timeWindow`}
              label="Zeitfenster"
              placeholder="z.B. 08:00 Uhr bis 12:00 Uhr"
              validate={validateField(100, i, true)}
            />
            {amountRows > 1 && (
              <IconButton
                color="danger"
                variant="outlined"
                aria-label="Zeile löschen"
                sx={{
                  marginTop: "1.6875rem",
                  marginBottom: "auto",
                }}
                onClick={() => remove(i)}
              >
                <Delete />
              </IconButton>
            )}
          </Stack>
        </Stack>,
      );
    }

    return rows;
  }

  return (
    <Stack gap={3} flex={1}>
      <FieldArrayWithFocus
        name={`${props.name}.rows`}
        valueLength={amountRows}
        render={({ push, remove, setInputElementRef }) => (
          <Stack gap={3}>
            {createRows(remove, setInputElementRef)}
            <Button
              color="primary"
              variant="plain"
              sx={{
                alignSelf: "flex-start",
              }}
              startDecorator={<Add />}
              onClick={() => push({ weekday: "", timeWindow: "" })}
            >
              Weitere Zeile
            </Button>
          </Stack>
        )}
      />
      <Divider />
      <TextareaField
        label="Zusatzinformationen"
        placeholder="z.B. Nur nach Terminabsprache; donnerstags nur in den hessischen Schulferien"
        name={`${props.name}.additionalInfo`}
        validate={validateField(150)}
      />
    </Stack>
  );
}
