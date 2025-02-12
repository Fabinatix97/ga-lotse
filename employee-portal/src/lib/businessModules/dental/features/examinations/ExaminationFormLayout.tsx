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

import { PageGrid } from "@/lib/shared/components/page/PageGrid";

import { AdditionalInformationFormValues } from "./AdditionalInformationFormSection";
import { NoteFormValues } from "./NoteFormSection";

export interface ExaminationFormValues
  extends AdditionalInformationFormValues,
    NoteFormValues {}

interface ExaminationFormLayoutProps {
  additionalInformation: ReactNode;
  dentalExamination?: ReactNode;
  note: ReactNode;
}

export function ExaminationFormLayout(props: ExaminationFormLayoutProps) {
  return (
    <PageGrid>
      <Grid xxs={12} md={3}>
        {props.additionalInformation}
      </Grid>
      <Grid container xxs={12} md={9}>
        {isDefined(props.dentalExamination) && (
          <Grid xxs={12}>{props.dentalExamination}</Grid>
        )}
        <Grid xxs={12}>{props.note}</Grid>
      </Grid>
    </PageGrid>
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
