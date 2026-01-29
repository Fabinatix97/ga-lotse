/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Formik } from "formik";
import { useId, useState } from "react";

import { FormPlus } from "@eshg/lib-portal";
import {
  cleanOptionalValues,
  mapAnamnesis,
} from "@eshg/official-medical-service";

import { usePostAnamnesisCitizen } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenAuthApi";
import { AnamnesisWrapper } from "@/lib/businessModules/officialMedicalService/components/personalArea/anamnesis/AnamnesisWrapper";
import {
  ANAMNESIS_TOTAL_STEPS,
  AnamnesisFormValues,
  INITIAL_VALUES,
} from "@/lib/businessModules/officialMedicalService/components/personalArea/anamnesis/common";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { StepCounter } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormWrapper";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageTitle } from "@/lib/shared/components/layout/page";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export default function CitizenOmsEntryPage() {
  const { t } = useTranslation(["officialMedicalService/anamnesis"]);
  const router = useScopedRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = ANAMNESIS_TOTAL_STEPS;

  const { mutateAsync: submitAnamnesis } = usePostAnamnesisCitizen();

  async function handleSubmit(anamnesis: AnamnesisFormValues) {
    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    await submitAnamnesis({
      anamnesis: mapAnamnesis(cleanOptionalValues(anamnesis)),
    });
    router.push(citizenRoutes.personalArea.index(accessCode));
  }

  const titleId = useId();
  const stepperTitleId = useId();
  return (
    <PageContent>
      <PageTitle
        titleId={titleId}
        toolbar={
          <StepCounter
            stepperTitleId={stepperTitleId}
            stepperTitle={t("common.stepTitle", {
              currentStepIndex: stepIndex + 1,
              totalSteps,
            })}
          />
        }
      >
        {t("common.title")}
      </PageTitle>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <FormPlus
          autoFocus
          aria-labelledby={titleId}
          aria-describedby={stepperTitleId}
        >
          <AnamnesisWrapper stepIndex={stepIndex} setStepIndex={setStepIndex} />
        </FormPlus>
      </Formik>
    </PageContent>
  );
}
