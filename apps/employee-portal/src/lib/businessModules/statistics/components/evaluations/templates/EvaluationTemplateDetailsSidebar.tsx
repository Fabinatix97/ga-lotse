/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EditOutlined } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { isDefined } from "remeda";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { DetailsList, formatDate } from "@eshg/lib-portal";

import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import {
  Analyses,
  Attributes,
  DataSource,
  Sensitivity,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";
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
  onUploadEvaluation: () => void;
}

function EvaluationTemplateDetailsSidebar({
  onClose,
  evaluationTemplateId,
  onEditEvaluationTemplate,
  onCreateEvaluation,
  onUploadEvaluation,
}: EvaluationTemplateDetailsSidebarProps) {
  const evaluationTemplateDetails =
    useGetEvaluationTemplateDetails(evaluationTemplateId);

  const userPermissions = useStatisticsRoleChecks();
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
          <DetailsList>
            <Stack gap={3}>
              {isDefined(evaluationTemplateDetails.description) && (
                <>
                  <Typography sx={visuallyHidden} role="term">
                    Beschreibung
                  </Typography>
                  <Typography level="body-md" role="definition">
                    {evaluationTemplateDetails.description}
                  </Typography>
                </>
              )}
              <Stack gap={1}>
                <Typography level="title-md" role="term">
                  Erstellt von
                </Typography>
                <Box display="contents" role="definition">
                  <UserLink user={evaluationTemplateDetails.user} />
                </Box>
              </Stack>
              <Stack gap={1}>
                <Typography level="title-md" role="term">
                  Erstellt am
                </Typography>
                <Typography level="body-md" role="definition">
                  {formatDate(evaluationTemplateDetails.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </DetailsList>
          <Divider />
          <Typography level="h3" component="h2">
            Vorlagendetails
          </Typography>
          <DetailsList>
            <Stack gap={3}>
              <DataSource
                dataSourceName={evaluationTemplateDetails.dataSourceName}
              />
              <Sensitivity
                dataSourceSensitivity={
                  evaluationTemplateDetails.dataSourceSensitivity
                }
              />
              <Attributes
                attributeLabels={evaluationTemplateDetails.attributeLabels}
              />
            </Stack>
          </DetailsList>
          <Analyses analyses={evaluationTemplateDetails.analyses} />
          {canWrite && (
            <Stack gap={3}>
              <Divider />
              <Button
                variant="plain"
                endDecorator={<ArrowForwardIcon />}
                sx={{ alignSelf: "end" }}
                onClick={() => {
                  onClose();
                  onUploadEvaluation();
                }}
              >
                Auswertungsvorlage hochladen
              </Button>
            </Stack>
          )}
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
            canWrite &&
            evaluationTemplateDetails.userMayCreateEvaluation && (
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
