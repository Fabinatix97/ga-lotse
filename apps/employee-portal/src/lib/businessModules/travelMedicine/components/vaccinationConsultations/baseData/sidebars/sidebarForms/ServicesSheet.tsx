/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Button, Divider, Sheet, Stack, Typography } from "@mui/joy";
import { FieldArray, useFormikContext } from "formik";

import { validateNonNegativeNumberWithAtMostTwoDecimalDigits } from "@eshg/lib-employee-portal";
import {
  NumberField,
  SelectField,
  TextareaField,
  validatePipe,
  validateRange,
} from "@eshg/lib-portal";
import {
  ApiDisease,
  ApiOtherServiceTemplate,
  ApiVaccine,
} from "@eshg/travel-medicine-api";

import { initServicesValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/AddServicePlanSidebar";
import { AddServicePlanFormValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AddServicePlanForm";
import { OtherServicesFields } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/OtherServicesFields";
import { VaccinationFields } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/VaccinationFields";

interface ServicesSheetProps {
  allOtherServiceTemplates: ApiOtherServiceTemplate[];
  allVaccines: ApiVaccine[];
  allDiseases: ApiDisease[];
}

export function ServicesSheet(props: Readonly<ServicesSheetProps>) {
  const { values } = useFormikContext<AddServicePlanFormValues>();

  return (
    <>
      <Typography level="body-md" sx={{ fontWeight: "bold", paddingTop: 2 }}>
        Leistungen
      </Typography>
      <FieldArray name="services">
        {({ push, remove }) => (
          <>
            {values.services.map((val, index) => (
              <Sheet key={index}>
                <Stack direction="column" gap={2} data-testid="services">
                  <SelectField
                    name={`services.${index}.serviceType`}
                    label="Leistungsart"
                    options={[
                      { value: "VACCINATION", label: "Impfung" },
                      { value: "OTHER", label: "Sonstiges" },
                      {
                        value: "OTHER_TEMPLATES",
                        label: "Vordefinierte Leistung",
                      },
                    ]}
                    required="Bitte eine Leistungsart auswählen."
                  />
                  {val.serviceType === "VACCINATION" && (
                    <VaccinationFields
                      val={val}
                      index={index}
                      allVaccines={props.allVaccines}
                      allDiseases={props.allDiseases}
                    />
                  )}
                  {val.serviceType === "OTHER" && (
                    <>
                      <TextareaField
                        name={`services.${index}.description`}
                        label="Beschreibung"
                      />
                      <NumberField
                        name={`services.${index}.fee`}
                        label="Preis in €"
                        required="Bitte einen Preis in € angeben"
                        min={0}
                        max={999999}
                        validate={validatePipe(
                          validateRange(0, 999999),
                          validateNonNegativeNumberWithAtMostTwoDecimalDigits,
                        )}
                      />
                    </>
                  )}
                  {val.serviceType === "OTHER_TEMPLATES" && (
                    <OtherServicesFields
                      val={val}
                      index={index}
                      allTemplates={props.allOtherServiceTemplates}
                    />
                  )}
                  {index > 0 && (
                    <>
                      <Divider />
                      <Button
                        color="danger"
                        variant="plain"
                        size="sm"
                        sx={{ marginLeft: "auto" }}
                        onClick={() => remove(index)}
                      >
                        Leistung entfernen
                      </Button>
                    </>
                  )}
                </Stack>
              </Sheet>
            ))}
            <Button
              startDecorator={<Add />}
              color="primary"
              variant="plain"
              size="sm"
              sx={{ marginRight: "auto" }}
              onClick={() => {
                push(initServicesValues);
              }}
            >
              Leistung hinzufügen
            </Button>
          </>
        )}
      </FieldArray>
    </>
  );
}
