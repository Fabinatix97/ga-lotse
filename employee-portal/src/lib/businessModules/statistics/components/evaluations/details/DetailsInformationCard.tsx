/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStatisticsFeature } from "@eshg/employee-portal-api/statistics";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import {
  AddchartOutlined,
  Delete,
  Download,
  Edit,
  FileCopy,
  Menu,
} from "@mui/icons-material";
import { Button, ColorPaletteProp, Stack } from "@mui/joy";
import { isPlainObject } from "remeda";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import {
  LabelValuePair,
  StyledValue,
} from "@/lib/shared/components/infoTile/LabelValuePair";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";

export interface DetailsInformationCardProps {
  canWrite: boolean;
  canDelete: boolean;
  canUpdateStatistic: boolean;
  canExportData: boolean;
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy: string;
  onEvaluationCreateClicked: () => void;
  onDataBasisUpdateClicked: () => void;
  onNameChangeClicked: () => void;
  onStatisticDeleteClicked: () => void;
  onStatisticDuplicateClicked: () => void;
  onSaveEvaluationTemplateClicked: () => void;
  onDataExport: () => Promise<void>;
}

export function DetailsInformationCard(props: DetailsInformationCardProps) {
  const cloneStatisticFeatureToggle = useIsNewFeatureEnabled(
    ApiStatisticsFeature.CloneStatistic,
  );
  const canDuplicateStatistic = props.canWrite && cloneStatisticFeatureToggle;

  const exportDataFeatureToggle = useIsNewFeatureEnabled(
    ApiStatisticsFeature.FakeAnonymization,
  );
  const canExportData = props.canExportData && exportDataFeatureToggle;

  const { canDelete, canUpdateStatistic, canWrite } = props;

  return (
    <InfoTile
      name="aggregation-details"
      title="Details"
      footer={
        canWrite && (
          <Stack
            alignItems={{ md: "start" }}
            marginTop={2}
            flexDirection="row"
            gap={2}
          >
            <Button
              startDecorator={<AddchartOutlined />}
              variant="solid"
              onClick={props.onEvaluationCreateClicked}
            >
              Analyse erstellen
            </Button>
            {props.canUpdateStatistic && (
              <Button
                variant="outlined"
                onClick={props.onDataBasisUpdateClicked}
              >
                Datenbasis aktualisieren
              </Button>
            )}
          </Stack>
        )
      }
      controls={
        (canUpdateStatistic ||
          canDuplicateStatistic ||
          canDelete ||
          canWrite) && (
          <ActionsMenu
            actionItems={[
              canUpdateStatistic && {
                label: "Name ändern",
                onClick: () => props.onNameChangeClicked(),
                startDecorator: <Edit />,
              },
              canWrite && {
                label: "Als Vorlage speichern",
                onClick: () => props.onSaveEvaluationTemplateClicked(),
                startDecorator: <Menu />,
              },
              canDuplicateStatistic && {
                label: "Duplizieren",
                onClick: () => props.onStatisticDuplicateClicked(),
                startDecorator: <FileCopy />,
              },
              canExportData && {
                label: "Daten exportieren",
                onClick: () => props.onDataExport(),
                startDecorator: <Download />,
              },
              canDelete && {
                label: "Löschen",
                onClick: () => props.onStatisticDeleteClicked(),
                startDecorator: <Delete />,
                color: "danger" as ColorPaletteProp,
              },
            ].filter(isPlainObject)}
          />
        )
      }
    >
      <Stack gap={1}>
        <LabelValuePair
          label={"Zeitraum"}
          value={
            <StyledValue>
              {formatDateRangeNumeric(props.start, props.end)}
            </StyledValue>
          }
        />
        <LabelValuePair
          label="Erstellungsdatum"
          value={formatDate(props.createdAt, "DE")}
        />
        <LabelValuePair label="Erstellt von" value={props.createdBy} />
      </Stack>
    </InfoTile>
  );
}
