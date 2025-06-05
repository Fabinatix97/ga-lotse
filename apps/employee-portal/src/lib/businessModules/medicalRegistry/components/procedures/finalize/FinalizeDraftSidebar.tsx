/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik, FormikHelpers } from "formik";
import { useMemo, useState } from "react";
import { isDefined } from "remeda";

import {
  SidebarForm,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { createFieldNameMapper, useSnackbar } from "@eshg/lib-portal";
import { ApiGetProcedureDraftResponse } from "@eshg/medical-registry-api";

import {
  DraftConfirmInfo,
  GroupedEmployeeChoices,
  mapToResolvedEmployeeChange,
} from "@/lib/businessModules/medicalRegistry/api/model/confirmInfo";
import { useGetConfirmInfo } from "@/lib/businessModules/medicalRegistry/api/queries/draft";
import { EmployeeSidebarContent } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/EmployeeSidebarContent";
import { FacilitySidebarContent } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/FacilitySidebarContent";
import { FinalizeDraftSidebarActions } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/FinalizeDraftSidebarActions";
import { usePartialEntryErrorSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/PartialEntryErrorSidebar";
import { PersonSidebarContent } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/PersonSidebarContent";
import { ProcedureSidebarContent } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/ProcedureSidebarContent";
import { isPartialDraft } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/helper";
import { useConfirmDraftDialog } from "@/lib/businessModules/medicalRegistry/components/procedures/finalize/useConfirmDraftDialog";

export function useFinalizeDraft(procedure: ApiGetProcedureDraftResponse) {
  const snackbar = useSnackbar();
  const confirmDraftDialog = useConfirmDraftDialog();
  const finalizeDraftSidebar = useSidebarWithFormRef({
    component: FinalizeDraftSidebar,
  });
  const partialEntryErrorSidebar = usePartialEntryErrorSidebar();
  function openPartialEntryErrorSidebar() {
    partialEntryErrorSidebar.open({ procedure });
  }

  const { refetch, isLoading } = useGetConfirmInfo(procedure);

  async function finalizeDraft() {
    const { isSuccess, data: confirmInfo } = await refetch();
    if (!isSuccess) {
      snackbar.error(
        "Der Daten zu diesem Entwurf konnten nicht abgerufen werden.",
      );
      return;
    }

    const { persons, facilities } = confirmInfo;
    if (isPartialDraft(procedure) && persons.length === 0) {
      openPartialEntryErrorSidebar();
    } else if (persons.length > 0 || facilities.length > 0) {
      finalizeDraftSidebar.open({
        procedure,
        confirmInfo,
        onSelectNoMatch: openPartialEntryErrorSidebar,
      });
    } else {
      confirmDraftDialog.open({
        isUpdate: false,
        params: { procedure },
      });
    }
  }

  return { isLoading, finalizeDraft };
}

export const FORM_OPTION_NEW = "new";
export const FORM_OPTION_NO_MATCH = "no-match";

interface FinalizeDraftSidebarFormValues {
  personId: string;
  facilityId: string;
  procedureId: string;
  personCandidateEntryIds: string[];
}
const fieldName = createFieldNameMapper<FinalizeDraftSidebarFormValues>();

type FinalizeStep = "persons" | "facilities" | "procedures" | "employees";

interface FinalizeDraftSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiGetProcedureDraftResponse;
  confirmInfo: DraftConfirmInfo;
  onSelectNoMatch: () => void;
}
function FinalizeDraftSidebar({
  procedure,
  onSelectNoMatch,
  confirmInfo,
  formRef,
  onClose,
}: FinalizeDraftSidebarProps) {
  const {
    persons,
    facilities,
    employeeChoicesByProcedure,
    proceduresByPerson,
  } = confirmInfo;
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [selectedProcedureId, setSelectedProcedureId] = useState("");

  function findProceduresByPerson(personId: string) {
    return proceduresByPerson[personId] ?? [];
  }
  function findEmployeeChoicesByProcedure(
    procedureId: string,
  ): GroupedEmployeeChoices {
    return (
      employeeChoicesByProcedure[procedureId] ?? {
        resolvedEmployeeChoices: [],
        openEmployeeChoices: [],
      }
    );
  }

  const selectedPerson = findSelectedReferenceById(persons, selectedPersonId);
  const procedureChoices = findProceduresByPerson(selectedPersonId);
  const employeeChoices = findEmployeeChoicesByProcedure(selectedProcedureId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [employeeIndex, setEmployeeIndex] = useState(0);
  const isInitialStep = currentStepIndex === 0;
  const steps = useMemo(() => {
    const availableSteps: FinalizeStep[] = [];
    if (persons.length !== 0) availableSteps.push("persons");
    if (facilities.length !== 0) availableSteps.push("facilities");

    // For simplicity assume that the procedure and employee steps are always available
    // and skip them if there are no procedures or employee changes to choose from
    if (persons.length !== 0) availableSteps.push("procedures");
    if (persons.length !== 0) availableSteps.push("employees");
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

    if (currentStepName === "employees" && employeeIndex > 0) {
      setEmployeeIndex((index) => index - 1);
    } else {
      setCurrentStepIndex((index) => Math.max(index - 1, 0));
    }
  }

  const confirmDraftDialog = useConfirmDraftDialog({
    onConfirm: () => onClose(true),
  });

  function openConfirmDraftDialog(values: FinalizeDraftSidebarFormValues) {
    const person = findSelectedReferenceById(persons, values.personId);
    const facility = findSelectedReferenceById(facilities, values.facilityId);
    const targetProcedure = findSelectedReferenceById(
      findProceduresByPerson(values.personId),
      values.procedureId,
    );

    const { openEmployeeChoices, resolvedEmployeeChoices } =
      findEmployeeChoicesByProcedure(values.procedureId);
    const resolvedOpenEmployeeChoices = openEmployeeChoices.map(
      ({ employeeChange, personCandidates }, choiceIndex) => {
        const selectedEntryId = values.personCandidateEntryIds[choiceIndex];
        const personCandidateChoice = personCandidates.find(
          ({ entryId }) => entryId === selectedEntryId,
        )!;

        return mapToResolvedEmployeeChange(
          employeeChange.employeeChangeId,
          personCandidateChoice,
        );
      },
    );

    const employeeChanges = [
      ...resolvedEmployeeChoices,
      ...resolvedOpenEmployeeChoices,
    ];

    confirmDraftDialog.open({
      isUpdate: isDefined(targetProcedure),
      params: {
        procedure,
        professionalReferencePerson: person,
        practiceReferenceFacility: facility,
        target: targetProcedure,
        employeeChanges,
      },
    });
  }

  async function handleSubmit(
    values: FinalizeDraftSidebarFormValues,
    {
      setSubmitting,
      setFieldValue,
    }: FormikHelpers<FinalizeDraftSidebarFormValues>,
  ) {
    setSubmitting(false);
    if (
      values.personId === FORM_OPTION_NO_MATCH ||
      values.procedureId === FORM_OPTION_NO_MATCH
    ) {
      onClose(true);
      onSelectNoMatch();
      return;
    }

    setSelectedPersonId(values.personId);
    setSelectedProcedureId(values.procedureId);

    const { openEmployeeChoices } = findEmployeeChoicesByProcedure(
      values.procedureId,
    );
    if (values.procedureId !== selectedProcedureId) {
      const initialFieldValue = openEmployeeChoices.map(() => null);
      await setFieldValue(
        fieldName("personCandidateEntryIds"),
        initialFieldValue,
      );
    }

    const isWithinEmployeeStep =
      currentStepName === "employees" &&
      employeeIndex + 1 < openEmployeeChoices.length;
    if (isWithinEmployeeStep) {
      setEmployeeIndex((subStepIndex) => subStepIndex + 1);
      return;
    }

    if (!isDefined(nextStepName)) {
      openConfirmDraftDialog(values);
      return;
    }

    const availableProcedures = findProceduresByPerson(values.personId);
    const hasNoProcedures = availableProcedures.length === 0;
    const hasNoOpenEmployeeChoices = openEmployeeChoices.length === 0;
    const shouldSkipRemainingSteps =
      (nextStepName === "procedures" && hasNoProcedures) ||
      (nextStepName === "employees" && hasNoOpenEmployeeChoices);

    if (shouldSkipRemainingSteps) {
      openConfirmDraftDialog(values);
    } else {
      gotoNextStep();
    }
  }

  return (
    <Formik
      initialValues={
        {
          personId: "",
          facilityId: "",
          procedureId: "",
          personCandidateEntryIds: [],
        } as const
      }
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          {currentStepName === "persons" && (
            <PersonSidebarContent
              fieldName={fieldName("personId")}
              procedure={procedure}
              persons={persons}
              showNoMatchOption={isPartialDraft(procedure)}
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
              procedures={procedureChoices}
              showNoMatchOption={isPartialDraft(procedure)}
            />
          )}
          {currentStepName === "employees" && (
            <EmployeeSidebarContent
              baseFieldName={fieldName("personCandidateEntryIds")}
              step={employeeIndex}
              employeeChoices={employeeChoices.openEmployeeChoices}
            />
          )}

          <FinalizeDraftSidebarActions
            isSubmitting={isSubmitting}
            isInitialStep={isInitialStep}
            onBackButtonClick={gotoPreviousStep}
          />
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
