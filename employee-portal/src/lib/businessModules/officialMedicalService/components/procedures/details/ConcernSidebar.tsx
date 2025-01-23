/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiConcern,
  ApiConcernCategoryConfig,
  ApiConcernConfig,
  ApiEmployeeOmsProcedureDetails,
  ApiGetConcernsResponse,
} from "@eshg/employee-portal-api/officialMedicalService";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Grid } from "@mui/joy";
import { Formik, useFormikContext } from "formik";

import { useUpdateOmsProcedureConcern } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { useGetAllConcerns } from "@/lib/businessModules/officialMedicalService/api/queries/concerns";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export interface ConcernSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiEmployeeOmsProcedureDetails;
}

interface ConcernFormType {
  category: string | null;
  concern: string | null;
}

export function useConcernSidebar() {
  return useSidebarWithFormRef({
    component: ConcernSidebar,
  });
}

export function ConcernSidebar({
  onClose,
  procedure,
  formRef,
}: Readonly<ConcernSidebarProps>) {
  const { mutateAsync: updateConcern } = useUpdateOmsProcedureConcern();
  const { data: allConcernsResponse } = useGetAllConcerns();

  const initialValues: ConcernFormType = {
    category: procedure.concern
      ? getCategoryKeyFromConcern(procedure.concern)
      : null,
    concern: procedure.concern
      ? getConcernKeyFromConcern(procedure.concern)
      : null,
  };

  const categoryOptions =
    categoryOptionsFromConcernsResponse(allConcernsResponse);

  const concernMap: Map<string, ApiConcernConfig> =
    allConcernsResponse.categories
      .flatMap((category) => category.concerns)
      .reduce((map, concern) => {
        map.set(getConcernKeyFromConcernConfig(concern), concern);
        return map;
      }, new Map<string, ApiConcernConfig>());

  const categoryMap: Map<string, ApiConcernCategoryConfig> =
    allConcernsResponse.categories.reduce((map, category) => {
      map.set(getCategoryKeyFromCategoryConfig(category), category);
      return map;
    }, new Map<string, ApiConcernCategoryConfig>());

  async function handleSubmit(values: ConcernFormType) {
    if (values.concern !== null) {
      const concern = concernMap.get(values.concern)!;
      await updateConcern(
        {
          id: procedure.id,
          concern: {
            ...concern,
            version: procedure.concern?.version ?? 0,
            categoryNameDe: categoryMap.get(values.category!)!.nameDe,
            categoryNameEn: categoryMap.get(values.category!)!.nameEn,
          },
        },
        {
          onSuccess: () => onClose(true),
        },
      );
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, handleSubmit }) => (
        <SidebarForm onSubmit={handleSubmit} ref={formRef}>
          <SidebarContent
            title={
              procedure.concern ? "Anliegen bearbeiten" : "Anliegen hinzufügen"
            }
          >
            <Grid container columnSpacing={2} rowSpacing={3}>
              <Grid xs={12}>
                <CategoryField options={categoryOptions} />
              </Grid>
              <Grid xs={12}>
                <ConcernField allConcernsResponse={allConcernsResponse} />
              </Grid>
            </Grid>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function CategoryField({
  options,
}: Readonly<{ options: SelectOption<string>[] }>) {
  return (
    <SelectField
      name="category"
      label="Kategorie des Anliegens"
      options={options}
      required="Bitte ein Anliegen auswählen."
    />
  );
}

function ConcernField({
  allConcernsResponse,
}: Readonly<{ allConcernsResponse: ApiGetConcernsResponse }>) {
  const {
    values: { category },
  } = useFormikContext<ConcernFormType>();

  const options = category
    ? optionsFromConcernsResponse(allConcernsResponse, category)
    : [];

  return (
    <SelectField
      name="concern"
      label="Anliegen"
      options={options}
      required="Bitte ein Anliegen auswählen."
    />
  );
}

function optionsFromConcernsResponse(
  concernsResponse: ApiGetConcernsResponse,
  categoryKey: string,
): SelectOption<string>[] {
  return concernsResponse.categories
    .filter(
      (category) => categoryKey === getCategoryKeyFromCategoryConfig(category),
    )
    .flatMap((category) =>
      category.concerns.map((concern) => ({
        value: getConcernKeyFromConcernConfig(concern),
        label: concern.nameDe,
      })),
    );
}

function categoryOptionsFromConcernsResponse(
  concernsResponse: ApiGetConcernsResponse,
) {
  return concernsResponse.categories.map((category) => ({
    value: getCategoryKeyFromCategoryConfig(category),
    label: category.nameDe,
  }));
}

function getCategoryKeyFromCategoryConfig(
  category: ApiConcernCategoryConfig,
): string {
  return category.nameDe;
}

function getCategoryKeyFromConcern(concern: ApiConcern): string {
  return concern.categoryNameDe;
}

function getConcernKeyFromConcernConfig(concern: ApiConcernConfig): string {
  return concern.nameDe;
}

function getConcernKeyFromConcern(concern: ApiConcern): string {
  return concern.nameDe;
}
