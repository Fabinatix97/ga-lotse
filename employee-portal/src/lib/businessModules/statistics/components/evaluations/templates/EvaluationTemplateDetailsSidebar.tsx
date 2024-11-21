/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { EditOutlined } from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import {
  Analyses,
  Attributes,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticRoleChecks";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { UserLink } from "@/lib/shared/components/users/UserLink";

export function useEvaluationTemplateDetailsSidebar(): UseSidebarResult<EvaluationTemplateDetailsSidebarProps> {
  return useSidebar({
    component: EvaluationTemplateDetailsSidebar,
  });
}

interface EvaluationTemplateDetailsSidebarProps extends DrawerProps {
  evaluationTemplateId: string;
  onEditEvaluationTemplate: () => void;
  onCreateEvaluation: () => void;
}

function EvaluationTemplateDetailsSidebar({
  onClose,
  evaluationTemplateId,
  onEditEvaluationTemplate,
  onCreateEvaluation,
}: EvaluationTemplateDetailsSidebarProps) {
  const evaluationTemplateDetails =
    useGetEvaluationTemplateDetails(evaluationTemplateId);

  const userPermissions = useStatisticRoleChecks();
  const canUpdateEvaluationTemplate =
    userPermissions.canUpdateEvaluationTemplate(
      evaluationTemplateDetails.user?.userId,
    );
  const canWrite = userPermissions.canWrite();

  return (
    <>
      <SidebarContent title="Auswertungsvorlage">
        <Stack gap={3}>
          <Stack direction="row" gap={1} alignItems="center">
            <Typography level="h3" component="h2" sx={{ flex: 1 }}>
              {evaluationTemplateDetails.name}
            </Typography>
            {canUpdateEvaluationTemplate && (
              <IconButton
                aria-label="Auswertungsvorlage bearbeiten"
                variant="outlined"
                color="primary"
                size="sm"
                sx={{ alignSelf: "flex-start" }}
                onClick={() => {
                  onClose();
                  onEditEvaluationTemplate();
                }}
              >
                <EditOutlined />
              </IconButton>
            )}
          </Stack>
          {isDefined(evaluationTemplateDetails.description) && (
            <Typography level="body-md">
              {evaluationTemplateDetails.description}
            </Typography>
          )}
          <Stack gap={1}>
            <Typography level="title-md">Erstellt von</Typography>
            <UserLink user={evaluationTemplateDetails.user} />
          </Stack>
          <Stack gap={1}>
            <Typography level="title-md">Erstellt am</Typography>
            <Typography level="body-md">
              {formatDate(evaluationTemplateDetails.createdAt)}
            </Typography>
          </Stack>
          <Divider />
          <Typography level="h3" component="h2">
            Vorlagendetails
          </Typography>
          <Stack gap={1}>
            <Typography level="title-md">Datenquelle</Typography>
            <Typography level="body-md">
              {evaluationTemplateDetails.dataSourceName}
            </Typography>
          </Stack>
          <Attributes
            attributeLabels={evaluationTemplateDetails.attributeLabels}
          />
          <Analyses analyses={evaluationTemplateDetails.analyses} />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          left={
            <Button variant="plain" onClick={() => onClose()}>
              Abbrechen
            </Button>
          }
          right={
            canWrite && (
              <Button
                onClick={() => {
                  onClose();
                  onCreateEvaluation();
                }}
              >
                Auswertung erstellen
              </Button>
            )
          }
        />
      </SidebarActions>
    </>
  );
}
