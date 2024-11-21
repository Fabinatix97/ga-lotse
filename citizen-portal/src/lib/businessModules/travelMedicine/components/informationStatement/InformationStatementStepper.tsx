/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDocumentContent,
  ApiDocumentSection,
} from "@eshg/citizen-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import {
  MultiStepForm,
  StepFactory,
} from "@eshg/lib-portal/components/form/MultiStepForm";
import { Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { useRouter, useSearchParams } from "next/navigation";

import { usePatchCitizenInformationStatement } from "@/lib/businessModules/travelMedicine/api/mutations/citizenAuthApi";
import { useGetInformationStatement } from "@/lib/businessModules/travelMedicine/api/queries/citizenAuthApi";
import { InformationStatementPanel } from "@/lib/businessModules/travelMedicine/components/informationStatement/InformationStatementPanel";
import { InformationStatementStep } from "@/lib/businessModules/travelMedicine/components/informationStatement/InformationStatementStep";
import { MultiStepFormTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormWrapper";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

export interface InformationStatementFormValues {
  informationStatement: ApiDocumentContent;
  signer: string;
  signature?: Blob;
}

export function InformationStatementStepper() {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { t } = useTranslation([
    "travelMedicine/informationStatements",
    "travelMedicine/signature",
  ]);

  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const procedureId = searchParams.get("procedureId");
  const procedureStepId = searchParams.get("procedureStepId");

  const statementId = searchParams.get("statementId");
  if (!statementId) {
    throw new Error("StatementId missing in searchParams");
  }
  const { data: informationStatement } =
    useGetInformationStatement(statementId);
  const patchInformationStatement = usePatchCitizenInformationStatement();

  const initialFormikValues: InformationStatementFormValues = {
    informationStatement,
    signer: "",
  };

  function validateForm(values: InformationStatementFormValues) {
    const errors: FormikErrors<InformationStatementFormValues> = {};
    const tOptions = { ns: "travelMedicine/signature" };
    if (!values.signer) {
      errors.signer = t("panelSection.ownerRequired", tOptions);
    }
    if (!values.signature) {
      errors.signature = t("panelSection.signatureRequired", tOptions);
    }
    return errors;
  }

  async function handleSubmit(
    statementId: string,
    values: InformationStatementFormValues,
  ) {
    const wrappedRequest = {
      documentContentDto: values.informationStatement,
      signer: values.signer,
    };

    await patchInformationStatement.mutateAsync(
      { statementId, request: wrappedRequest, signature: values.signature! },
      { onSuccess: () => routeBackToDetails() },
    );
  }

  function routeBackToDetails() {
    const url = `${citizenRoutes.viewAppointment.details.index(accessCode)}?procedureId=${procedureId}&procedureStepId=${procedureStepId}`;
    router.push(url);
  }

  function createStepFunction(
    section: ApiDocumentSection,
    sectionIndex: number,
  ) {
    return function createStep() {
      return (
        <InformationStatementStep
          section={section}
          sectionIndex={sectionIndex}
        />
      );
    };
  }

  const STEPS: StepFactory<InformationStatementFormValues>[] =
    informationStatement.sections.map((section, sectionIndex) =>
      createStepFunction(section, sectionIndex),
    );

  return (
    <MultiStepForm<InformationStatementFormValues> steps={STEPS}>
      {({ Outlet, currentStep, totalSteps }) => (
        <Formik
          initialValues={initialFormikValues}
          onSubmit={async (values) => handleSubmit(statementId, values)}
          validate={validateForm}
        >
          {(formikProps) => (
            <Stack gap={2}>
              <MultiStepFormTitle
                title={t("header.title")}
                stepperTitle={t("header.stepText", {
                  currentStepIndex: currentStep,
                  totalSteps: totalSteps,
                })}
                withLogoutButton={true}
              />
              <FormPlus>
                <>
                  {isMobile ? (
                    <OneColumnGrid
                      contentTop={null}
                      contentCenter={
                        <>
                          {<Outlet {...formikProps} />}
                          <InformationStatementPanel
                            informationStatement={informationStatement}
                            onRouteBack={routeBackToDetails}
                          />
                        </>
                      }
                      contentBottom={null}
                    />
                  ) : (
                    <TwoColumnGrid
                      content={<Outlet {...formikProps} />}
                      sidePanel={
                        <InformationStatementPanel
                          informationStatement={informationStatement}
                          onRouteBack={routeBackToDetails}
                        />
                      }
                    />
                  )}
                </>
              </FormPlus>
            </Stack>
          )}
        </Formik>
      )}
    </MultiStepForm>
  );
}
