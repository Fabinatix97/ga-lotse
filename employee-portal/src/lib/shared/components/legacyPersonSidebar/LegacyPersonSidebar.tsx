/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  type ApiGetReferencePersonResponse,
  ApiProcedureStatus,
} from "@eshg/base-api";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { FormikErrors } from "formik";
import { ReactNode, useEffect, useRef, useState } from "react";
import { isNullish } from "remeda";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { LegacyMinimalPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import {
  LegacyPerson,
  LegacyPersonForm,
  LegacyPersonFormConfig,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import {
  Mode,
  createNewPerson,
  mapApiPersonData,
} from "@/lib/shared/components/legacyPersonSidebar/personSidebarHelper";
import { ProcedureList } from "@/lib/shared/components/legacyPersonSidebar/procedures/ProcedureList";
import { LegacyPersonSearch } from "@/lib/shared/components/legacyPersonSidebar/search/LegacyPersonSearch";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export interface ProcedureLiteItem {
  link: string;
  reportingDate: Date;
  reportingReason?: string;
  status: ApiProcedureStatus;
}

interface LegacyPersonSidebarProps {
  open: boolean;
  onClose: () => void;
  searchFormTitle?: string;
  personFormTitle: string;
  mode?: Mode;
  config: LegacyPersonFormConfig;
  person?: LegacyPerson;
  validate?: (person: LegacyPerson) => FormikErrors<LegacyPerson>;
  onSubmit: (person: LegacyPerson) => Promise<unknown>;
  // a function can be passed to detect procedures linked with the selected person
  listProcedures?: (
    person: ApiGetReferencePersonResponse,
  ) => Promise<ProcedureLiteItem[]>;
  skipEditPersonAfterSearch?: boolean;
  personSearchFormAdditionalFields?: () => ReactNode;
  personSearchFormInitialValues?: LegacyMinimalPerson;
  showPostalAddress?: boolean;
}

export function LegacyPersonSidebar({
  open,
  onClose,
  personFormTitle,
  searchFormTitle,
  mode: pMode,
  config: pConfig,
  person: pPerson,
  onSubmit,
  validate,
  listProcedures,
  skipEditPersonAfterSearch,
  personSearchFormAdditionalFields,
  personSearchFormInitialValues,
  showPostalAddress = undefined,
}: LegacyPersonSidebarProps) {
  const [mode, setMode] = useState<Mode>(pMode ?? Mode.searchInCentralFile);
  const [selectedPerson, setSelectedPerson] = useState<LegacyPerson | null>(
    isNullish(pPerson) ? null : pPerson,
  );
  const person = pPerson ?? selectedPerson;

  useEffect(() => {
    setSelectedPerson(isNullish(pPerson) ? null : pPerson);
  }, [pPerson]);

  const [existingProcedures, setExistingProcedures] = useState<
    ProcedureLiteItem[]
  >([]);

  const { openCancelDialog } = useConfirmationDialog();
  const sidebarPersonFormRef = useRef<SidebarFormHandle>(null);
  const sidebarSearchFormRef = useRef<SidebarFormHandle>(null);
  const searchTitle = searchFormTitle ?? personFormTitle;

  function resetAndCloseForm() {
    onClose();
    sidebarPersonFormRef.current?.resetForm();
    sidebarSearchFormRef.current?.resetForm();
    setMode(pMode ?? Mode.searchInCentralFile);
  }

  function handleCancel() {
    if (
      !sidebarPersonFormRef.current?.dirty &&
      !sidebarSearchFormRef.current?.dirty
    ) {
      resetAndCloseForm();
    } else {
      openCancelDialog({
        onConfirm: resetAndCloseForm,
      });
    }
  }

  async function handleSelectPerson(person: ApiGetReferencePersonResponse) {
    let procedures: ProcedureLiteItem[] = [];
    if (listProcedures) {
      procedures = await listProcedures(person).catch(() => {
        return [];
      });
    }
    if (skipEditPersonAfterSearch) {
      await onSubmit(mapApiPersonData(person));
      onClose();
    }

    setExistingProcedures(procedures);

    setSelectedPerson(mapApiPersonData(person));
    setMode(
      procedures.length > 0
        ? Mode.listProceduresForPerson
        : Mode.editInCentralFile,
    );
  }

  function handleCreatePerson(person: LegacyMinimalPerson) {
    setSelectedPerson(createNewPerson(person));
    setMode(Mode.editInCentralFile);
  }

  async function submit(person: LegacyPerson) {
    await onSubmit(person);
    resetAndCloseForm();
  }

  return (
    <Sidebar open={open} onClose={handleCancel}>
      {mode === Mode.listProceduresForPerson ? (
        <ProcedureList
          onContinue={() => {
            setMode(Mode.editInCentralFile);
          }}
          onCancel={handleCancel}
          procedures={existingProcedures}
          personName={formatPersonName(person)}
        />
      ) : mode === Mode.editInCentralFile && person ? (
        <LegacyPersonForm
          sidebarFormRef={sidebarPersonFormRef}
          title={personFormTitle}
          person={selectedPerson ?? createNewPerson(person)}
          onCancel={handleCancel}
          config={pConfig}
          validate={validate}
          onSubmit={submit}
          showPostalAddress={showPostalAddress}
        />
      ) : (
        <OverlayBoundary>
          <LegacyPersonSearch
            sidebarFormRef={sidebarSearchFormRef}
            onSelectPerson={handleSelectPerson}
            onCreatePerson={handleCreatePerson}
            onCancel={handleCancel}
            title={searchTitle}
            personSearchFormAdditionalFields={personSearchFormAdditionalFields}
            personSearchFormInitialValues={personSearchFormInitialValues}
          />
        </OverlayBoundary>
      )}
    </Sidebar>
  );
}
