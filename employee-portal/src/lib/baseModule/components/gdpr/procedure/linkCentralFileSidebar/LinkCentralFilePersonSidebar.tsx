/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Formik } from "formik";
import { useRef } from "react";
import { isNonNullish } from "remeda";

import { mapAddCentralFileIdToGdprProcedureRequest } from "@/lib/baseModule/api/mapper/gdpr";
import { useAddCentralFileIdToGdprProcedure } from "@/lib/baseModule/api/mutations/gdpr";
import { PersonDetails } from "@/lib/baseModule/components/gdpr/procedure/linkCentralFileSidebar/PersonDetails";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { LegacyPersonSearchResults } from "@/lib/shared/components/legacyPersonSidebar/search/LegacyPersonSearchResults";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface FormValues {
  selected: ApiGetReferencePersonResponse | null;
}

interface LinkCentralFilePersonSidebarProps {
  procedureId: string;
  procedureVersion: number;
  centralFilePersons: ApiGetReferencePersonResponse[];
  open: boolean;
  onClose: () => void;
}

export function LinkCentralFilePersonSidebar({
  procedureId,
  procedureVersion,
  centralFilePersons,
  open,
  onClose,
}: LinkCentralFilePersonSidebarProps) {
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const { openConfirmationDialog } = useConfirmationDialog();

  const addCentralFileIdToGdprProcedure =
    useAddCentralFileIdToGdprProcedure(procedureId);

  function closeAndReset() {
    onClose();
    sidebarFormRef.current?.resetForm();
  }

  async function handleSubmit({ selected }: FormValues) {
    if (isNonNullish(selected)) {
      await addCentralFileIdToGdprProcedure
        .mutateAsync(
          mapAddCentralFileIdToGdprProcedureRequest(selected, procedureVersion),
          { onSuccess: closeAndReset },
        )
        .catch();
    } else {
      closeAndReset();
    }
  }

  const initialValues: FormValues = {
    selected: null,
  };

  return (
    <Sidebar open={open} onClose={closeAndReset}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          openConfirmationDialog({
            title: "Stammdaten anheften",
            description:
              "Wollen Sie diese Stammdaten an diesen Vorgang anheften?",
            onConfirm: async () => {
              await handleSubmit(values);
            },
          });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <>
            {isNonNullish(values.selected) ? (
              <SidebarForm ref={sidebarFormRef}>
                <SidebarContent title={formatPersonName(values.selected)}>
                  <PersonDetails selectedPerson={values.selected} />
                </SidebarContent>
                <SidebarActions>
                  <MultiFormButtonBar
                    onCancel={closeAndReset}
                    onBack={() => setFieldValue("selected", null)}
                    submitting={isSubmitting}
                    submitLabel={"Auswählen"}
                  />
                </SidebarActions>
              </SidebarForm>
            ) : (
              <LegacyPersonSearchResults
                persons={centralFilePersons}
                title={"Mögliche Stammdaten"}
                onSelectPerson={async (person) => {
                  await setFieldValue("selected", person);
                }}
                onCancel={closeAndReset}
              />
            )}
          </>
        )}
      </Formik>
    </Sidebar>
  );
}
