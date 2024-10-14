/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { Add } from "@mui/icons-material";
import { Button, Divider, Sheet, Stack, Typography } from "@mui/joy";
import { FieldArray, useFormikContext } from "formik";

import { useGetAllDiseasesUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useGetAllOtherServiceTemplatesUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/otherServiceTemplates";
import { useGetAllVaccinesUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/vaccines";
import { OtherServicesFields } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/OtherServicesFields";
import {
  ServiceValues,
  initServicesValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanSidebar";
import { VaccinationFields } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationFields";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { validateNonNegativeNumberWithAtMostTwoDecimalDigits } from "@/lib/shared/helpers/validators";

export function ServicesSheet(props: Readonly<{ open: boolean }>) {
  const { values } = useFormikContext<ServiceValues>();

  const getAllTemplates = useGetAllOtherServiceTemplatesUnsuspended(props.open);
  const allTemplates = getAllTemplates.data ?? [];
  const getAllVaccines = useGetAllVaccinesUnsuspended(props.open);
  const allVaccines = getAllVaccines.data ?? [];
  const getAllDiseases = useGetAllDiseasesUnsuspended(props.open);
  const allDiseases = getAllDiseases.data ?? [];

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
                      allVaccines={allVaccines}
                      allDiseases={allDiseases}
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
                        validate={
                          validateNonNegativeNumberWithAtMostTwoDecimalDigits
                        }
                      />
                    </>
                  )}
                  {val.serviceType === "OTHER_TEMPLATES" && (
                    <OtherServicesFields
                      val={val}
                      index={index}
                      allTemplates={allTemplates}
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
