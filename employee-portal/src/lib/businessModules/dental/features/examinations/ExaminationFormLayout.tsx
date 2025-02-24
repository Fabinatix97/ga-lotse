/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ExaminationResult } from "@eshg/dental/api/models/ExaminationResult";
import { parseOptionalValue } from "@eshg/lib-portal/helpers/form";
import { Grid } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { AdditionalInformationFormValues } from "./AdditionalInformationFormSection";
import { NoteFormValues } from "./NoteFormSection";

export interface ExaminationFormValues
  extends AdditionalInformationFormValues,
    NoteFormValues {}

interface ExaminationFormLayoutProps {
  additionalInformation: ReactNode;
  childInformation: ReactNode;
  dentalExamination?: ReactNode;
  note: ReactNode;
}

export function ExaminationFormLayout(props: ExaminationFormLayoutProps) {
  return (
    <Grid container spacing={3}>
      <Grid xxs={12} md={3} alignContent="flex-start">
        <Grid container spacing={3} columns={12}>
          <Grid xxs={6} md={12}>
            {props.additionalInformation}
          </Grid>
          <Grid xxs={6} md={12}>
            {props.childInformation}
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} md={9} alignContent="flex-start">
        <Grid container spacing={3} columns={12}>
          {isDefined(props.dentalExamination) && (
            <Grid xxs={12}>{props.dentalExamination}</Grid>
          )}
          <Grid xxs={12}>{props.note}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export function mapToExaminationFormValues(
  examinationResult: ExaminationResult | undefined,
  note: string | undefined,
): ExaminationFormValues {
  return {
    note: parseOptionalValue(note),
    ...mapExaminationResultFormValues(examinationResult),
  };
}

function mapExaminationResultFormValues(
  examinationResult: ExaminationResult | undefined,
): AdditionalInformationFormValues {
  if (examinationResult?.type === "screening") {
    return {
      oralHygieneStatus: parseOptionalValue(
        examinationResult.oralHygieneStatus,
      ),
      fluorideVarnishApplied: parseOptionalValue(
        examinationResult.fluorideVarnishApplied,
      ),
    };
  }

  if (examinationResult?.type === "fluoridation") {
    return {
      oralHygieneStatus: "",
      fluorideVarnishApplied: parseOptionalValue(
        examinationResult.fluorideVarnishApplied,
      ),
    };
  }

  return { oralHygieneStatus: "", fluorideVarnishApplied: "" };
}
