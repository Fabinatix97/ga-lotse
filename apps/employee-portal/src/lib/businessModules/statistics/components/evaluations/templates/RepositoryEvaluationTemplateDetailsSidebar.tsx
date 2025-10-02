/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Divider, Stack, Typography } from "@mui/joy";
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
import { Alert, DetailsList, formatDate } from "@eshg/lib-portal";

import { useDownloadEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useDownloadRepositoryEvaluationTemplate";
import { useGetEvaluationTemplateFromRepository } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateFromRepository";
import {
  Analyses,
  Attributes,
  DataSource,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";

export function useRepositoryEvaluationTemplateDetailsSidebar(): UseSidebarResult<RepositoryEvaluationTemplateDetailsSidebarProps> {
  return useSidebar({
    component: RepositoryEvaluationTemplateDetailsSidebar,
  });
}

interface RepositoryEvaluationTemplateDetailsSidebarProps extends DrawerProps {
  evaluationTemplateId: number;
  evaluationTemplateVersion: number;
}

function RepositoryEvaluationTemplateDetailsSidebar({
  onClose,
  evaluationTemplateId,
  evaluationTemplateVersion,
}: RepositoryEvaluationTemplateDetailsSidebarProps) {
  const evaluationTemplateDetails = useGetEvaluationTemplateFromRepository(
    evaluationTemplateId,
    evaluationTemplateVersion,
  );
  const downloadEvaluationTemplate = useDownloadEvaluationTemplate(onClose);

  return (
    <>
      <SidebarContent title="Vorlage herunterladen">
        <Stack gap={3}>
          <Alert
            color="primary"
            message="Eine Kopie der geteilten Auswertungsvorlage wird in die internen Vorlagen übernommen und bereitgestellt."
          />
          <Divider />
          <Typography level="h3" component="h2">
            {evaluationTemplateDetails.name}
          </Typography>
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
              {isDefined(evaluationTemplateDetails.contact) && (
                <Stack gap={1}>
                  <Typography level="title-md" role="term">
                    Kontakt
                  </Typography>
                  <Typography level="body-md" role="definition">
                    {evaluationTemplateDetails.contact}
                  </Typography>
                </Stack>
              )}
              <Stack gap={1}>
                <Typography level="title-md" role="term">
                  Herkunft
                </Typography>
                <Typography level="body-md" role="definition">
                  {evaluationTemplateDetails.origin}
                </Typography>
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
              <Attributes
                attributeLabels={evaluationTemplateDetails.attributeLabels}
              />
            </Stack>
          </DetailsList>
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
            <Button
              onClick={async () => {
                await downloadEvaluationTemplate(
                  evaluationTemplateId,
                  evaluationTemplateVersion,
                );
              }}
            >
              Herunterladen
            </Button>
          }
        />
      </SidebarActions>
    </>
  );
}
