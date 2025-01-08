/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UpdateChildRequest } from "@eshg/employee-portal-api/dental";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Divider, Stack } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";

import { SCHOOL_OR_DAYCARE } from "@/lib/baseModule/api/queries/contacts";
import { ChildDetails } from "@/lib/businessModules/dental/api/models/ChildDetails";
import { Institution } from "@/lib/businessModules/dental/api/models/Institution";
import { useUpdateAnnualChild } from "@/lib/businessModules/dental/api/mutations/childApi";
import { SearchGroupField } from "@/lib/businessModules/dental/features/prophylaxisSessions/SearchGroupField";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SelectMultipleContactsField } from "@/lib/shared/components/formFields/SelectMultipleContactsField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useUpdateAnnualChildSidebar(): UseSidebarWithFormRefResult<UpdateAnnualChildSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateAnnualChildSidebar,
  });
}

export interface UpdateAnnualChildValues {
  institution: Institution;
  groupName: string;
}

interface UpdateAnnualChildSidebarProps extends SidebarWithFormRefProps {
  child: ChildDetails;
}

function useUpdateAnnualChildForm(
  annualChild: ChildDetails,
  onSuccess: () => void,
) {
  const updateAnnualChild = useUpdateAnnualChild(annualChild.id);
  const snackbar = useSnackbar();
  return useFormik<UpdateAnnualChildValues>({
    initialValues: {
      institution: annualChild.institution,
      groupName: annualChild.groupName,
    },
    onSubmit: (values) => {
      updateAnnualChild
        .mutateAsync(mapValues(values, annualChild), {
          onSuccess,
        })
        .catch(() =>
          snackbar.error("Die Daten konnten nicht geändert werden."),
        );
    },
  });
}

function mapValues(
  values: UpdateAnnualChildValues,
  annualChild: ChildDetails,
): UpdateChildRequest {
  return {
    childId: annualChild.id,
    apiUpdateChildRequest: {
      groupName: values.groupName,
      institutionId: values.institution.id,
      version: annualChild.version,
    },
  };
}

function UpdateAnnualChildSidebar(props: UpdateAnnualChildSidebarProps) {
  const annualChild = props.child;
  const form = useUpdateAnnualChildForm(annualChild, () => props.onClose(true));
  const { isSubmitting } = form;

  return (
    <>
      <FormikProvider value={form}>
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Zusatzinfos">
            <Stack gap={2}>
              <SelectMultipleContactsField
                name="institution"
                label="Einrichtung"
                categories={SCHOOL_OR_DAYCARE}
              />
              <Divider />
              <SearchGroupField
                name="groupName"
                label="Gruppe"
                institutionId={annualChild.institution.id}
                freeSolo
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitting={isSubmitting}
              submitLabel="Speichern"
              onCancel={props.onClose}
            />
          </SidebarActions>
        </SidebarForm>
      </FormikProvider>
    </>
  );
}
