/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";
import { ReactNode, useEffect, useRef, useState } from "react";
import { isNullish } from "remeda";

import { type ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  OverlayBoundary,
  Sidebar,
  SidebarFormHandle,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";

import { useGetAllAppointmentTypesUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import {
  InitialAppointmentForm,
  InitialAppointmentFormValuesProps,
} from "@/lib/businessModules/travelMedicine/components/personSidebar/appointment/InitialAppointmentForm";
import { PersonForm } from "@/lib/businessModules/travelMedicine/components/personSidebar/person/PersonForm";
import { PersonSidebarMode } from "@/lib/businessModules/travelMedicine/components/personSidebar/personSidebarHelper";
import { LegacyMinimalPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import {
  LegacyPerson,
  LegacyPersonFormConfig,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import {
  createNewPerson,
  mapApiPersonData,
} from "@/lib/shared/components/legacyPersonSidebar/personSidebarHelper";
import { LegacyPersonSearch } from "@/lib/shared/components/legacyPersonSidebar/search/LegacyPersonSearch";

interface PersonSidebarProps {
  open: boolean;
  onClose: () => void;
  searchFormTitle?: string;
  personFormTitle: string;
  mode?: PersonSidebarMode;
  config: LegacyPersonFormConfig;
  person?: LegacyPerson;
  validate?: (person: LegacyPerson) => FormikErrors<LegacyPerson>;
  onSubmit: (
    person: InitialAppointmentFormValuesProps | LegacyPerson,
    resetAndClose?: () => void,
  ) => Promise<unknown>;
  skipEditPersonAfterSearch?: boolean;
  personSearchFormAdditionalFields?: () => ReactNode;
  personSearchFormInitialValues?: LegacyMinimalPerson;
  showPostalAddress?: boolean;
  skipInitialAppointmentSelection?: boolean;
}

export function PersonSidebar({
  open,
  onClose,
  personFormTitle,
  searchFormTitle,
  mode: pMode,
  config: pConfig,
  person: pPerson,
  onSubmit,
  validate,
  skipEditPersonAfterSearch,
  personSearchFormAdditionalFields,
  personSearchFormInitialValues,
  showPostalAddress = undefined,
  skipInitialAppointmentSelection = true,
}: PersonSidebarProps) {
  const snackbar = useSnackbar();

  const [personSidebarMode, setPersonSidebarMode] = useState<PersonSidebarMode>(
    pMode ?? PersonSidebarMode.searchInCentralFile,
  );
  const [selectedPerson, setSelectedPerson] = useState<LegacyPerson | null>(
    isNullish(pPerson) ? null : pPerson,
  );
  const person = pPerson ?? selectedPerson;

  useEffect(() => {
    // update editFacility when the facility changes from outside
    setSelectedPerson(isNullish(pPerson) ? null : pPerson);
  }, [pPerson]);

  const { openCancelDialog } = useConfirmationDialog();
  const sidebarPersonFormRef = useRef<SidebarFormHandle>(null);
  const sidebarSearchFormRef = useRef<SidebarFormHandle>(null);
  const searchTitle = searchFormTitle ?? personFormTitle;

  function resetAndCloseForm() {
    onClose();
    sidebarPersonFormRef.current?.resetForm();
    sidebarSearchFormRef.current?.resetForm();
    setPersonSidebarMode(pMode ?? PersonSidebarMode.searchInCentralFile);
  }

  function resetForm() {
    sidebarPersonFormRef.current?.resetForm();
    sidebarSearchFormRef.current?.resetForm();
    setPersonSidebarMode(pMode ?? PersonSidebarMode.searchInCentralFile);
  }

  function handleCancel() {
    if (!sidebarPersonFormRef.current?.dirty) {
      return resetAndCloseForm();
    }

    openCancelDialog({
      onConfirm: resetAndCloseForm,
    });
  }

  function handleSelectPerson(person: ApiGetReferencePersonResponse) {
    return new Promise<void>((resolve) => {
      if (skipEditPersonAfterSearch) {
        next(mapApiPersonData(person));
      } else {
        setSelectedPerson(mapApiPersonData(person));
        setPersonSidebarMode(PersonSidebarMode.editInCentralFile);
      }

      resolve();
    });
  }

  function handleCreatePerson(person: LegacyMinimalPerson) {
    setSelectedPerson(createNewPerson(person));
    setPersonSidebarMode(PersonSidebarMode.editInCentralFile);
  }

  async function submitPerson(person: LegacyPerson) {
    if (JSON.stringify(selectedPerson) === JSON.stringify(person)) {
      snackbar.notification("Daten wurden nicht verändert");
      resetForm();
    } else {
      await onSubmit(person, resetAndCloseForm);
    }
  }

  function next(person: LegacyPerson) {
    setSelectedPerson(person);
    setPersonSidebarMode(PersonSidebarMode.bookAppointment);
  }

  async function submitPersonAndAppointment(
    values: InitialAppointmentFormValuesProps,
  ) {
    if (selectedPerson) {
      await onSubmit(values, resetAndCloseForm);
    }
  }

  const getAllAppointmentTypes = useGetAllAppointmentTypesUnsuspended(open);
  const consultationStandardDuration = getAllAppointmentTypes.data
    ? getAllAppointmentTypes.data.find(
        (type) => type.appointmentTypeDto === ApiAppointmentType.Consultation,
      )!.standardDurationInMinutes
    : "";

  //Boundaries should be placed outside of the sidebar but they won't work correctly either way
  // and this way seems to cause the least trouble
  //TODO place OverlayBoundaries outside of sidebar when PersonSidebar gets refactored
  return (
    <Sidebar open={open} onClose={handleCancel}>
      {personSidebarMode === PersonSidebarMode.bookAppointment ? (
        <OverlayBoundary>
          <InitialAppointmentForm
            initialValues={{
              selectedPerson: selectedPerson!,
              initialStepAppointmentType: ApiAppointmentType.Consultation,
              appointmentTypeStandardDuration:
                consultationStandardDuration as number,
              bookingType: "" as ApiAppointmentBookingType,
            }}
            onSubmit={submitPersonAndAppointment}
            onCancel={resetAndCloseForm}
          />
        </OverlayBoundary>
      ) : personSidebarMode === PersonSidebarMode.editInCentralFile &&
        person ? (
        <PersonForm
          sidebarFormRef={sidebarPersonFormRef}
          title={personFormTitle}
          person={selectedPerson ?? createNewPerson(person)}
          config={pConfig}
          validate={validate}
          showPostalAddress={showPostalAddress}
          skipInitialAppointmentSelection={skipInitialAppointmentSelection}
          onCancel={resetAndCloseForm}
          onSubmit={(data) =>
            skipInitialAppointmentSelection ? submitPerson(data) : next(data)
          }
        />
      ) : (
        <OverlayBoundary>
          <LegacyPersonSearch
            sidebarFormRef={sidebarSearchFormRef}
            title={searchTitle}
            personSearchFormAdditionalFields={personSearchFormAdditionalFields}
            personSearchFormInitialValues={personSearchFormInitialValues}
            onSelectPerson={handleSelectPerson}
            onCreatePerson={handleCreatePerson}
            onCancel={resetAndCloseForm}
          />
        </OverlayBoundary>
      )}
    </Sidebar>
  );
}
