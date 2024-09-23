/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/base";
import { Delete } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { isDefined } from "remeda";

import { useDeleteStatisticsScheme } from "@/lib/businessModules/statistics/api/mutations/useDeleteStatisticsScheme";
import { ChooseDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseDataSourceStep/chooseDataSourceStepFormModel";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export interface Scheme {
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
  schemes: Scheme[];
  viewCreateStatistics: () => void;
}) {
  const { setFieldValue } = useFormikContext<ChooseDataSourceStepFormModel>();
  const schemesExist = props.schemes.length > 0;

  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteStatisticsScheme = useDeleteStatisticsScheme();
  const canWrite = useStatisticRoleChecks().canWrite();

  function deleteSchemeWithConfirmation(schemeId: string) {
    openConfirmationDialog({
      title: "Vorlage Löschen?",
      description: "Möchten Sie die Vorlage wirklich löschen?",
      confirmLabel: "Löschen",
      onConfirm: () => deleteStatisticsScheme(schemeId),
      color: "danger",
    });
  }

  return (
    <>
      {!schemesExist && (
        <NoSearchResults
          info="Keine Vorlagen vorhanden"
          buttonLabel="Neue Statistik erstellen"
          onClick={props.viewCreateStatistics}
        />
      )}
      {schemesExist && (
        <Stack flexDirection="column" gap={2}>
          <Typography>Wählen Sie eine Vorlage:</Typography>
          <RadioGroupField
            name="_schemeId"
            onChange={(id) => {
              const scheme = props.schemes.find((it) => it.id === id)!;
              void setFieldValue("scheme", scheme);
            }}
            required="Bitte Vorlage auswählen"
          >
            <Stack gap={2}>
              {props.schemes.map((scheme) => (
                <Stack key={scheme.id} sx={{ position: "relative" }}>
                  <SelectableCard
                    key={scheme.id}
                    value={scheme.id}
                    radioProps={{ disabled: !isDefined(scheme.dataSource) }}
                  >
                    {isDefined(scheme.dataSource) && (
                      <Stack gap={0.5}>
                        <Typography level="title-md">{scheme.name}</Typography>
                        <Typography level="body-sm">
                          {
                            businessModuleNames[
                              scheme.dataSource.businessModule
                            ]
                          }
                        </Typography>
                        <Typography level="body-sm">
                          {scheme.dataSource.attributes
                            .map((it) => it.name)
                            .join(", ")}
                        </Typography>
                      </Stack>
                    )}
                    {!isDefined(scheme.dataSource) && (
                      <Stack>
                        <Typography level="title-md" color="neutral">
                          {scheme.name}
                        </Typography>
                        <Typography level="body-sm" color="danger">
                          Das Schema ist nicht korrekt.
                        </Typography>
                      </Stack>
                    )}
                  </SelectableCard>
                  {canWrite && (
                    <ActionsMenu
                      actionDescription={`Aktionen für die Vorlage ${scheme.name}`}
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
                            deleteSchemeWithConfirmation(scheme.id),
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
