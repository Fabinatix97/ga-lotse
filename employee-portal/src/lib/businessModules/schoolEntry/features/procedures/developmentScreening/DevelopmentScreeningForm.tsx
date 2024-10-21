/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiSchoolFeedback,
  ApiSchoolRecommendation,
} from "@eshg/employee-portal-api/schoolEntry";
import { FormProps, OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";

import { Percentiles } from "@/lib/businessModules/schoolEntry/api/models/examinations/Percentiles";
import { DevelopmentScreeningResultFields } from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/DevelopmentScreeningResultFields";
import {
  HandicapFields,
  HandicapFieldsValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/HandicapFields";
import { useIdc10Sidebar } from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/Icd10Sidebar";
import {
  MeasurementFields,
  MeasurementFieldsValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/MeasurementFields";
import {
  PhysicalExaminationFields,
  PhysicalExaminationFieldsValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/PhysicalExaminationFields";
import {
  PsychoSocialRiskFields,
  PsychoSocialRiskFieldsValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/PsychoSocialRiskFields";
import {
  SocioEducationalFields,
  SocioEducationalFieldsValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/SocioEducationalFields";
import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { FormStack } from "@/lib/shared/components/form/FormStack";

export interface DevelopmentScreeningFormValues {
  measurements: MeasurementFieldsValues;
  physicalExamination: PhysicalExaminationFieldsValues;
  handicap: HandicapFieldsValues;
  psychoSocialRisk: PsychoSocialRiskFieldsValues;
  socioEducationalPerformance: SocioEducationalFieldsValues;
  extraEffort: OptionalFieldValue<boolean>;
  schoolRecommendation: OptionalFieldValue<ApiSchoolRecommendation>;
  schoolFeedback: OptionalFieldValue<ApiSchoolFeedback>;
}

interface DevelopmentScreeningFormProps
  extends FormProps<DevelopmentScreeningFormValues> {
  procedureId: string;
  initialPercentiles: Percentiles;
}

export function DevelopmentScreeningForm(props: DevelopmentScreeningFormProps) {
  const icd10Sidebar = useIdc10Sidebar();

  function handleClickIcd10Code(
    currentCodes: string[],
    setFieldValue: (newCodes: string[]) => void,
  ) {
    icd10Sidebar.open({
      initiallySelectedCodes: currentCodes,
      onSubmit: (selectedCodes) => setFieldValue(selectedCodes),
    });
  }

  async function handleSubmit(
    formValues: DevelopmentScreeningFormValues,
    helpers: FormikHelpers<DevelopmentScreeningFormValues>,
  ) {
    await props.onSubmit(formValues);
    helpers.resetForm({ values: formValues });
  }

  return (
    <Formik initialValues={props.initialValues} onSubmit={handleSubmit}>
      {({ values, errors, isSubmitting, handleSubmit, setFieldValue }) => (
        <FormStack dense onSubmit={handleSubmit}>
          <ConfirmLeaveDirtyFormEffect />
          <MeasurementFields
            name="measurements"
            procedureId={props.procedureId}
            initialPercentiles={props.initialPercentiles}
            values={values.measurements}
            errors={errors.measurements}
          />
          <Divider />
          <PhysicalExaminationFields
            name="physicalExamination"
            values={values.physicalExamination}
            setFieldValue={setFieldValue}
            onClickIcd10Code={handleClickIcd10Code}
          />
          <Divider />
          <HandicapFields
            name="handicap"
            values={values.handicap}
            setFieldValue={setFieldValue}
            onClickIcd10Code={handleClickIcd10Code}
          />
          <Divider />
          <PsychoSocialRiskFields
            name="psychoSocialRisk"
            values={values.psychoSocialRisk}
            setFieldValue={setFieldValue}
          />
          <Divider />
          <SocioEducationalFields
            name="socioEducationalPerformance"
            values={values.socioEducationalPerformance}
            setFieldValue={setFieldValue}
          />
          <Divider />
          <DevelopmentScreeningResultFields />
          <FormFooter isSubmitting={isSubmitting} />
        </FormStack>
      )}
    </Formik>
  );
}
