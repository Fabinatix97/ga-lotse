/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import {
  ApiConcern,
  ApiConcernCategoryConfig,
  ApiConcernConfig,
  ApiEmployeeOmsProcedureDetails,
  ApiGetConcernsResponse,
} from "@eshg/official-medical-service-api";
import { Grid } from "@mui/joy";
import { Formik, useFormikContext } from "formik";

import { useUpdateOmsProcedureConcern } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { useGetAllConcerns } from "@/lib/businessModules/officialMedicalService/api/queries/concerns";

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

const ALL_CATEGORIES_KEY = "ALL_CATEGORIES";

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
      : ALL_CATEGORIES_KEY,
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
      for (const concern of category.concerns) {
        map.set(getConcernKeyFromConcernConfig(concern), category);
      }
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
            categoryNameDe: categoryMap.get(values.concern)!.nameDe,
            categoryNameEn: categoryMap.get(values.concern)!.nameEn,
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
}: Readonly<{
  allConcernsResponse: ApiGetConcernsResponse;
}>) {
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
      (category) =>
        categoryKey === ALL_CATEGORIES_KEY ||
        categoryKey === getCategoryKeyFromCategoryConfig(category),
    )
    .flatMap((category) =>
      category.concerns.map((concern) => ({
        value: getConcernKeyFromConcernConfig(concern),
        label: concern.nameDe,
      })),
    )
    .sort((c1, c2) => {
      if (c1.label > c2.label) {
        return 1;
      }
      if (c1.label < c2.label) {
        return -1;
      }
      return 0;
    });
}

function categoryOptionsFromConcernsResponse(
  concernsResponse: ApiGetConcernsResponse,
) {
  return [
    {
      value: ALL_CATEGORIES_KEY,
      label: "Alle Kategorien",
    },
    ...concernsResponse.categories.map((category) => ({
      value: getCategoryKeyFromCategoryConfig(category),
      label: category.nameDe,
    })),
  ];
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
