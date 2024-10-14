/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Switch, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useState } from "react";
import { isDefined } from "remeda";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { SaveStatisticStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/SaveStatisticStep/saveStatisticStepFormModel";
import { CreateStatisticFromScratchFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/createStatisticFromScratchFormModel";
import { CreateStatisticFromTemplateFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/createStatisticFromTemplateFormModel";
import { TimeSpanField } from "@/lib/shared/components/formFields/TimeSpanField";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export function SaveStatisticStep() {
  const { values, setFieldValue } = useFormikContext<
    CreateStatisticFromScratchFormModel & CreateStatisticFromTemplateFormModel
  >();

  const fieldName = createFieldNameMapper<SaveStatisticStepFormModel>();
  const [checked, setChecked] = useState<boolean>(false);

  function onCheckedChange(checked: boolean) {
    setChecked(checked);
    if (checked) {
      void setFieldValue("templateName", values.statisticName);
    } else {
      void setFieldValue("templateName", "");
    }
  }

  const isTemplateStepper = isDefined(values.template);

  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <InputField
          name={fieldName("statisticName")}
          label="Name der Auswertung"
          required="Bitte Name angeben."
        />
        {!isTemplateStepper && (
          <Stack gap={2}>
            <Stack direction={"row"} gap={1}>
              <Typography
                component={"label"}
                level="body-md"
                sx={{ "--Typography-gap": "8px" }}
                startDecorator={
                  <Switch
                    variant="outlined"
                    checked={checked}
                    onChange={(event) => onCheckedChange(event.target.checked)}
                    sx={{
                      "--Switch-trackWidth": "48px",
                      "--Switch-trackHeight": "24px",
                      "--Switch-thumbSize": "16px",
                    }}
                  />
                }
              >
                Auswertung als Vorlage speichern
              </Typography>
            </Stack>
            {checked && (
              <InputField
                name={fieldName("templateName")}
                label="Name der Vorlage"
                required="Bitte Name angeben."
              />
            )}
          </Stack>
        )}
      </Stack>
      <Divider />
      <Typography level="h3" component="h2">
        Betrachtungszeitraum
      </Typography>
      <TimeSpanField name="timeSpan" />
      <Divider />
      <Typography level="h4" component="h2">
        Zusammenfassung
      </Typography>
      <Stack gap={2}>
        <Typography level="title-md">Fachmodule</Typography>
        <Typography level="body-md">{getBusinessModuleName(values)}</Typography>
      </Stack>
      <Stack gap={2}>
        <Typography level="title-md">Attribute</Typography>
        <Stack gap={1}>
          {getSelectedAttributeNames(values).map((attributeName, index) => (
            <Typography key={index} level="body-md">
              {attributeName}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

function getBusinessModuleName(
  values: CreateStatisticFromScratchFormModel &
    CreateStatisticFromTemplateFormModel,
) {
  const businessModule = values.dataSource
    ? values.dataSource.businessModule
    : values.template!.dataSource!.businessModule;
  return businessModuleNames[mapToApiBusinessModule(businessModule)];
}

function getSelectedAttributeNames(
  values: CreateStatisticFromScratchFormModel &
    CreateStatisticFromTemplateFormModel,
) {
  if (values.selectedAttributes) {
    return values.selectedAttributes.map((it) => it.name);
  }
  return values.template!.dataSource!.attributes.map((it) => it.name);
}
