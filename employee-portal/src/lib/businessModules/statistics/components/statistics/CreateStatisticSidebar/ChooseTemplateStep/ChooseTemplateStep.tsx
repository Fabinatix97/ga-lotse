/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/base";
import { Delete } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { isDefined } from "remeda";

import { useDeleteEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteEvaluationTemplate";
import { ChooseDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseDataSourceStep/chooseDataSourceStepFormModel";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export interface Template {
  id: string;
  name: string;
  dataSource?: {
    id: string;
    attributes: {
      code: string;
      baseCode?: string;
      name: string;
    }[];
    businessModule: ApiBusinessModule;
  };
}

export function ChooseTemplateStep(props: {
  templates: Template[];
  viewCreateStatistics: () => void;
}) {
  const { setFieldValue } = useFormikContext<ChooseDataSourceStepFormModel>();
  const templatesExist = props.templates.length > 0;

  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteEvaluationTemplate = useDeleteEvaluationTemplate();
  const canWrite = useStatisticRoleChecks().canWrite();

  function deleteTemplateWithConfirmation(templateId: string) {
    openConfirmationDialog({
      title: "Vorlage Löschen?",
      description: "Möchten Sie die Vorlage wirklich löschen?",
      confirmLabel: "Löschen",
      onConfirm: () => deleteEvaluationTemplate(templateId),
      color: "danger",
    });
  }

  return (
    <>
      {!templatesExist && (
        <NoSearchResults
          info="Keine Vorlagen vorhanden"
          buttonLabel="Neue Auswertung erstellen"
          onClick={props.viewCreateStatistics}
        />
      )}
      {templatesExist && (
        <Stack flexDirection="column" gap={2}>
          <Typography>Wählen Sie eine Vorlage:</Typography>
          <RadioGroupField
            name="_templateId"
            onChange={(id) => {
              const template = props.templates.find((it) => it.id === id)!;
              void setFieldValue("template", template);
            }}
            required="Bitte Vorlage auswählen"
          >
            <Stack gap={2}>
              {props.templates.map((template) => (
                <Stack key={template.id} sx={{ position: "relative" }}>
                  <SelectableCard
                    key={template.id}
                    value={template.id}
                    radioProps={{ disabled: !isDefined(template.dataSource) }}
                  >
                    {isDefined(template.dataSource) && (
                      <Stack gap={0.5}>
                        <Typography level="title-md">
                          {template.name}
                        </Typography>
                        <Typography level="body-sm">
                          {
                            businessModuleNames[
                              template.dataSource.businessModule
                            ]
                          }
                        </Typography>
                        <Typography level="body-sm">
                          {template.dataSource.attributes
                            .map((it) => it.name)
                            .join(", ")}
                        </Typography>
                      </Stack>
                    )}
                    {!isDefined(template.dataSource) && (
                      <Stack>
                        <Typography level="title-md" color="neutral">
                          {template.name}
                        </Typography>
                        <Typography level="body-sm" color="danger">
                          Das Schema ist nicht korrekt.
                        </Typography>
                      </Stack>
                    )}
                  </SelectableCard>
                  {canWrite && (
                    <ActionsMenu
                      actionDescription={`Aktionen für die Vorlage ${template.name}`}
                      sx={{
                        position: "absolute",
                        right: (theme) => theme.spacing(1),
                        top: (theme) => theme.spacing(1),
                        zIndex: 1,
                      }}
                      actionItems={[
                        {
                          label: "Löschen",
                          onClick: () =>
                            deleteTemplateWithConfirmation(template.id),
                          startDecorator: <Delete />,
                        },
                      ]}
                    />
                  )}
                </Stack>
              ))}
            </Stack>
          </RadioGroupField>
        </Stack>
      )}
    </>
  );
}
