/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { useDownloadEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useDownloadRepositoryEvaluationTemplate";
import { useGetEvaluationTemplateFromRepository } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateFromRepository";
import {
  Analyses,
  Attributes,
  DataSource,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
          {isDefined(evaluationTemplateDetails.description) && (
            <Typography level="body-md">
              {evaluationTemplateDetails.description}
            </Typography>
          )}
          {isDefined(evaluationTemplateDetails.contact) && (
            <Stack gap={1}>
              <Typography level="title-md">Kontakt</Typography>
              <Typography level="body-md">
                {evaluationTemplateDetails.contact}
              </Typography>
            </Stack>
          )}
          <Stack gap={1}>
            <Typography level="title-md">Herkunft</Typography>
            <Typography level="body-md">
              {evaluationTemplateDetails.origin}
            </Typography>
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
          <DataSource
            dataSourceName={evaluationTemplateDetails.dataSourceName}
          />
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
