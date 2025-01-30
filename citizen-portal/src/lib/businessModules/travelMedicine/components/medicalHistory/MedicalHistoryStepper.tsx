/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { ApiDocumentContent } from "@eshg/travel-medicine-api";
import { FormikValues } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  PatchMedicalHistoryRequest,
  usePatchCitizenMedicalHistory,
} from "@/lib/businessModules/travelMedicine/api/mutations/citizenAuthApi";
import { useGetMedicalHistory } from "@/lib/businessModules/travelMedicine/api/queries/citizenAuthApi";
import { MedicalHistorySidePanel } from "@/lib/businessModules/travelMedicine/components/medicalHistory/MedicalHistorySidePanel";
import { DocumentSection } from "@/lib/businessModules/travelMedicine/components/shared/components/document/DocumentSection";
import { MultiStepFormWrapper } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormWrapper";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheetTitle } from "@/lib/shared/components/layout/contentSheet";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

export function MedicalHistoryStepper() {
  const { t } = useTranslation(["travelMedicine/medicalHistories"]);
  const isMobile = useIsMobile();
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const searchParams = useSearchParams();
  const procedureId = searchParams.get("procedureId");
  const procedureStepId = searchParams.get("procedureStepId");

  const { data: medicalHistory } = useGetMedicalHistory(
    procedureId!,
    procedureStepId!,
  );
  const patchCitizenMedicalHistory = usePatchCitizenMedicalHistory();

  const [currentStep, setCurrentStep] = useState(0);

  function routeBackToDetails() {
    const url = `${citizenRoutes.viewAppointment.details.index(accessCode)}?procedureId=${procedureId}&procedureStepId=${procedureStepId}`;
    router.push(url);
  }

  async function handleSubmit(values: FormikValues) {
    const request: PatchMedicalHistoryRequest = {
      procedureId: procedureId!,
      procedureStepId: procedureStepId!,
      medicalHistory: values as ApiDocumentContent,
    };
    await patchCitizenMedicalHistory.mutateAsync(request, {
      onSuccess: () => routeBackToDetails(),
    });
  }

  return (
    <MultiStepFormWrapper
      initialValues={medicalHistory}
      onSubmit={(values) => handleSubmit(values)}
      stepperTitle={t("header.stepText", {
        currentStepIndex: currentStep + 1,
        totalSteps: medicalHistory.sections.length,
      })}
      title={t("header.title")}
      withLogoutButton={true}
    >
      {isMobile ? (
        <OneColumnGrid
          contentTop={null}
          contentCenter={
            <>
              <DocumentSection
                sectionIndex={currentStep}
                documentSection={medicalHistory.sections.at(currentStep)!}
                documentHeader={
                  currentStep === 0 && (
                    <>
                      <ContentSheetTitle>
                        {t("briefing.title")}
                      </ContentSheetTitle>
                      <Alert
                        title={t("briefing.infoText")}
                        color="primary"
                        sx={{ padding: "16px" }}
                      />
                    </>
                  )
                }
              />
              <MedicalHistorySidePanel
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                medicalHistory={medicalHistory}
                onRouteBack={routeBackToDetails}
              />
            </>
          }
          contentBottom={null}
        />
      ) : (
        <TwoColumnGrid
          content={
            <DocumentSection
              sectionIndex={currentStep}
              documentSection={medicalHistory.sections.at(currentStep)!}
              documentHeader={
                currentStep === 0 && (
                  <>
                    <ContentSheetTitle>{t("briefing.title")}</ContentSheetTitle>
                    <Alert
                      title={t("briefing.infoText")}
                      color="primary"
                      sx={{ padding: "16px" }}
                    />
                  </>
                )
              }
            />
          }
          sidePanel={
            <MedicalHistorySidePanel
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              medicalHistory={medicalHistory}
              onRouteBack={routeBackToDetails}
            />
          }
        />
      )}
    </MultiStepFormWrapper>
  );
}
