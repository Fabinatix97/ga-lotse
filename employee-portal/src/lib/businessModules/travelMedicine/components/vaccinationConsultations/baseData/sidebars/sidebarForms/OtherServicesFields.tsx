/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors, useFormikContext } from "formik";

import { DetailsItem } from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { formatCurrency } from "@eshg/lib-portal/formatters/numbers";

import { OtherServicesTemplates } from "@/lib/businessModules/travelMedicine/api/models/OtherServicesTemplates";
import {
  AddServicePlanFormValues,
  ServicesRequest,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AddServicePlanForm";
import { createOtherServicesTemplateOptions } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";

interface OtherServicesFieldsProps {
  val: ServicesRequest;
  index: number;
  allTemplates: OtherServicesTemplates[];
}

export function OtherServicesFields({
  val,
  index,
  allTemplates,
}: Readonly<OtherServicesFieldsProps>) {
  const { setFieldValue } = useFormikContext<AddServicePlanFormValues>();

  async function getDescription(
    index: number,
    templateId: string,
    setFieldValue: (
      field: string,
      value: string,
    ) => Promise<void | FormikErrors<AddServicePlanFormValues>>,
  ) {
    if (templateId) {
      const template = allTemplates.find(
        (template) => template.id === templateId,
      );
      if (template) {
        await setFieldValue(
          `services.${index}.description`,
          template.description ?? "",
        );
      }
    }
  }

  async function getFeeForTemplate(
    index: number,
    templateId: string,
    setFieldValue: (
      field: string,
      value: number,
    ) => Promise<void | FormikErrors<AddServicePlanFormValues>>,
  ) {
    if (templateId) {
      const template = allTemplates.find(
        (template) => template.id === templateId,
      );
      if (template) {
        await setFieldValue(`services.${index}.fee`, template.fee ?? 0);
      }
    } else {
      await setFieldValue(`services.${index}.fee`, 0);
    }
  }

  return (
    <>
      <SelectField
        name={`services.${index}.templateId`}
        label="Beschreibung"
        placeholder="auswählen"
        options={createOtherServicesTemplateOptions(allTemplates)}
        required="Bitte eine Beschreibung auswählen."
        onChange={async (templateId) => {
          await getDescription(index, templateId, setFieldValue);
          await getFeeForTemplate(index, templateId, setFieldValue);
        }}
      />
      <DetailsItem
        label="Preis"
        value={formatCurrency(val.fee, {
          localeOption: "manual",
          locale: "de-DE",
        })}
      />
    </>
  );
}
