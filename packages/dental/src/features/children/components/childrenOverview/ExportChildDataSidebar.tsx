/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import {
  ButtonBar,
  SchoolYearField,
  SelectContactField,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  formatInstitutionNameWithCategoryShort,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  NullableFieldValue,
  OptionalFieldValue,
  SubmitButton,
  isEmptyString,
  useFileDownload,
} from "@eshg/lib-portal";

import { Institution } from "../../../../api/models/Institution";
import { SearchGroupField } from "../../../../components/group/SearchGroupField";
import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";
import { useDentalApi } from "../../../../contexts/dental";

export function useExportChildDataSidebar(): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({ component: ExportChildDataSidebar });
}

interface ExportChildDataSidebarValues {
  schoolYear: number;
  institution: NullableFieldValue<Institution>;
  groupName: OptionalFieldValue<string>;
}

const INITIAL_VALUES: ExportChildDataSidebarValues = {
  schoolYear: new Date(Date.now()).getFullYear(),
  institution: null,
  groupName: "",
};

function ExportChildDataSidebar(props: SidebarWithFormRefProps) {
  const { childApi } = useDentalApi();

  const { download } = useFileDownload((values: ExportChildDataSidebarValues) =>
    childApi.exportChildDataRaw({
      institutionId: values.institution?.id ?? "",
      groupName: isEmptyString(values.groupName) ? undefined : values.groupName,
      schoolYear: values.schoolYear,
    }),
  );

  async function submit(values: ExportChildDataSidebarValues) {
    await download(values);
    props.onClose(true);
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={submit}>
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Daten exportieren">
            <Stack gap={2}>
              <SchoolYearField
                name="schoolYear"
                label="Wählen Sie ein Schuljahr aus"
                required="Bitte ein Schuljahr auswählen."
                range={{ numberOfYearsInFuture: 1, numberOfYearsInPast: 1 }}
              />
              <SelectContactField
                name="institution"
                label="Einrichtung"
                categories={SCHOOL_OR_DAYCARE_CONTACT}
                required="Bitte eine Schule/Kita angeben."
                placeholder="Schule/Kita suchen"
                getOptionLabel={formatInstitutionNameWithCategoryShort}
              />
              <SearchGroupField
                name="groupName"
                label="Wählen Sie eine Gruppe aus"
                institution={values.institution}
                openGroupsOnly
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <ButtonBar
              right={
                <>
                  <Button
                    variant="soft"
                    color="neutral"
                    onClick={() => props.onClose()}
                  >
                    Abbrechen
                  </Button>
                  <SubmitButton submitting={isSubmitting}>
                    Exportieren
                  </SubmitButton>
                </>
              }
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
