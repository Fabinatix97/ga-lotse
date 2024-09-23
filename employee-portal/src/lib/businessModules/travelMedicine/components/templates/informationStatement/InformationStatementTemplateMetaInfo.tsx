/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDisease,
  ApiInformationStatementTemplateState,
} from "@eshg/employee-portal-api/travelMedicine";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Checkbox, FormLabel, Grid, List, ListItem } from "@mui/joy";

import { INFORMATION_STATEMENT_TEMPLATE_TYPE_OPTIONS } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/options";

interface TemplateMetaInfoProps {
  templateId: string;
  state: ApiInformationStatementTemplateState;
  allDiseases: ApiDisease[];
  checkboxStateMap: Map<string, boolean>;
  setFieldValue: SetFieldValueHelper;
}

export function InformationStatementTemplateMetaInfo(
  props: Readonly<TemplateMetaInfoProps>,
) {
  return (
    <>
      <Grid xs={12}>
        <InputField
          name="name"
          label="Name"
          required="Bitte einen Namen angeben."
          validate={validateLength(0, 200)}
          readOnly={props.state === ApiInformationStatementTemplateState.Final}
        />
      </Grid>
      <Grid xs={12}>
        <InputField
          name="title"
          label="Titel"
          required="Bitte einen Titel angeben."
          validate={validateLength(0, 200)}
          readOnly={props.state === ApiInformationStatementTemplateState.Final}
        />
      </Grid>
      {props.templateId.length > 0 && (
        <Grid xs={12}>
          <SelectField
            name="state"
            label="Status"
            options={INFORMATION_STATEMENT_TEMPLATE_TYPE_OPTIONS}
            required="Bitte einen Status auswählen."
            disabled={
              props.state === ApiInformationStatementTemplateState.Final
            }
          />
        </Grid>
      )}
      {props.allDiseases.length > 0 && (
        <Grid xs={12}>
          <FormLabel id="disease-list">Krankheiten</FormLabel>
          <List
            orientation="horizontal"
            wrap
            sx={{
              "--List-gap": "8px",
              "--ListItem-radius": "20px",
            }}
            aria-labelledby="disease-list"
          >
            {props.allDiseases.map((item) => (
              <ListItem key={item.id}>
                <Checkbox
                  name={item.name}
                  overlay
                  disableIcon
                  value={item.id}
                  label={item.name}
                  checked={props.checkboxStateMap.has(item.id)}
                  onChange={async (value) => {
                    if (!props.checkboxStateMap.has(item.id)) {
                      props.checkboxStateMap.set(value.target.value, true);
                      await props.setFieldValue(value.target.name, true);
                    } else {
                      props.checkboxStateMap.delete(value.target.value);
                      await props.setFieldValue(value.target.name, false);
                    }
                  }}
                  disabled={
                    props.state === ApiInformationStatementTemplateState.Final
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      )}
    </>
  );
}
