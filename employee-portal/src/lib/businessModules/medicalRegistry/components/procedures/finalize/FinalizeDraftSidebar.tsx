/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedureDraftResponse } from "@eshg/employee-portal-api/medicalRegistry";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Button } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { useMemo, useState } from "react";
import { isDefined } from "remeda";

import {
  ReferencePersonWithProcedures,
  SearchDraftReferencesResponse,
  useSearchDraftReferences,
} from "@/lib/businessModules/medicalRegistry/api/queries/draft";
import { FacilitySidebarContent } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/FacilitySidebarContent";
import { PersonSidebarContent } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/PersonSidebarContent";
import { ProcedureSidebarContent } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/ProcedureSidebarContent";
import { useConfirmDraftDialog } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/useConfirmDraftDialog";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useFinalizeDraft(procedure: ApiGetProcedureDraftResponse) {
  const confirmDraftDialog = useConfirmDraftDialog();
  const finalizeDraftSidebar = useSidebarWithFormRef({
    component: FinalizeDraftSidebar,
  });

  const { refetch, isLoading } = useSearchDraftReferences(procedure, {
    includePersonsWithoutProcedures: true,
  });

  async function finalizeDraft() {
    const { isSuccess, data: references } = await refetch();
    if (!isSuccess) {
      return;
    }

    const { persons, facilities } = references;
    if (persons.length === 0 && facilities.length === 0) {
      confirmDraftDialog.open({ procedure });
    } else {
      finalizeDraftSidebar.open({ procedure, references });
    }
  }

  return { isLoading, finalizeDraft };
}

export const FORM_OPTION_NEW = "new";
interface FinalizeDraftSidebarFormValues {
  personId: string;
  facilityId: string;
  procedureId: string;
}
const fieldName = createFieldNameMapper<FinalizeDraftSidebarFormValues>();

interface FinalizeDraftSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiGetProcedureDraftResponse;
  references: SearchDraftReferencesResponse;
}
type FinalizeStep = "persons" | "facilities" | "procedures";

function FinalizeDraftSidebar({
  procedure,
  references,
  formRef,
  onClose,
}: FinalizeDraftSidebarProps) {
  const { persons, facilities } = references;
  const [selectedPerson, setSelectedPerson] =
    useState<ReferencePersonWithProcedures>();
  const procedures = selectedPerson?.procedures ?? [];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const isInitialStep = currentStepIndex === 0;
  const steps = useMemo(() => {
    const availableSteps: FinalizeStep[] = [];
    if (persons.length !== 0) availableSteps.push("persons");
    if (facilities.length !== 0) availableSteps.push("facilities");

    // For simplicity assume that the procedures step is always available
    // and skip it if the selected person has no procedures to choose from
    if (persons.length !== 0) availableSteps.push("procedures");
    return availableSteps;
  }, [persons.length, facilities.length]);

  const currentStepName = steps[currentStepIndex];
  const nextStepName = steps[currentStepIndex + 1];

  function gotoNextStep() {
    setCurrentStepIndex((index) => index + 1);
  }
  function gotoPreviousStep() {
    if (isInitialStep) {
      onClose(true);
      return;
    }
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  }

  const confirmDraftDialog = useConfirmDraftDialog({
    onConfirm: () => onClose(true),
  });

  function openConfirmDraftDialog(values: FinalizeDraftSidebarFormValues) {
    const person = findSelectedReferenceById(persons, values.personId);
    const facility = findSelectedReferenceById(facilities, values.facilityId);
    const targetProcedure = findSelectedReferenceById(
      person?.procedures ?? [],
      values.procedureId,
    );

    confirmDraftDialog.open({
      procedure,
      professionalReferencePerson: person,
      practiceReferenceFacility: facility,
      target: targetProcedure,
    });
  }

  function handleSubmit(
    values: FinalizeDraftSidebarFormValues,
    { setSubmitting }: FormikHelpers<FinalizeDraftSidebarFormValues>,
  ) {
    setSubmitting(false);

    const referencePerson = findSelectedReferenceById(persons, values.personId);
    setSelectedPerson(referencePerson);

    const hasNoProcedures = !referencePerson?.procedures.length;
    const shouldSkipProceduresStep =
      nextStepName === "procedures" && hasNoProcedures;
    if (isDefined(nextStepName) && !shouldSkipProceduresStep) {
      gotoNextStep();
    } else {
      openConfirmDraftDialog(values);
    }
  }

  return (
    <Formik
      initialValues={{ personId: "", facilityId: "", procedureId: "" }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          {currentStepName === "persons" && (
            <PersonSidebarContent
              fieldName={fieldName("personId")}
              procedure={procedure}
              persons={persons}
            />
          )}
          {currentStepName === "facilities" && (
            <FacilitySidebarContent
              fieldName={fieldName("facilityId")}
              procedure={procedure}
              facilities={facilities}
            />
          )}
          {currentStepName === "procedures" && (
            <ProcedureSidebarContent
              fieldName={fieldName("procedureId")}
              person={selectedPerson!}
              procedures={procedures}
            />
          )}
          <SidebarActions>
            <ButtonBar
              left={
                <Button
                  variant="plain"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={gotoPreviousStep}
                >
                  {isInitialStep ? "Abbrechen" : "Zurück"}
                </Button>
              }
              right={
                <SubmitButton
                  submitting={isSubmitting}
                  sx={{ minWidth: "fit-content" }}
                >
                  Weiter
                </SubmitButton>
              }
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function findSelectedReferenceById<T extends { id: string }>(
  options: T[],
  selectedId: string,
) {
  if (selectedId === FORM_OPTION_NEW) return undefined;
  return options.find((option) => option.id === selectedId);
}
