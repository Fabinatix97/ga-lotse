/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { AddchartOutlined, Delete, Edit, FileCopy } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
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
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy: string;
  onEvaluationCreateClicked: () => void;
  onDataBasisUpdateClicked: () => void;
  onNameChangeClicked: () => void;
  onStatisticDeleteClicked: () => void;
  onStatisticDuplicateClicked: () => void;
}

export function DetailsInformationCard(props: DetailsInformationCardProps) {
  const cloneStatisticFeatureToggle = useIsNewFeatureEnabled("CLONE_STATISTIC");

  const canDuplicateStatistic = props.canWrite && cloneStatisticFeatureToggle;
  const { canDelete, canUpdateStatistic } = props;

  return (
    <InfoTile
      name="aggregation-details"
      title="Details"
      footer={
        props.canWrite && (
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
              data-testid="create-evaluation-button"
            >
              Analyse erstellen
            </Button>
            {/* TODO: Comment out for now, replace when feature-toggle is ready */}
            {/* <Button
              variant="outlined"
              onClick={props.onDataBasisUpdateClicked}
              data-testid="update-data-button"
            >
              Datenbasis aktualisieren
            </Button> */}
          </Stack>
        )
      }
      controls={
        (canUpdateStatistic || canDuplicateStatistic || canDelete) && (
          <ActionsMenu
            actionItems={[
              canUpdateStatistic && {
                label: "Name ändern",
                onClick: () => props.onNameChangeClicked(),
                startDecorator: <Edit />,
              },
              canDuplicateStatistic && {
                label: "Duplizieren",
                onClick: () => props.onStatisticDuplicateClicked(),
                startDecorator: <FileCopy />,
              },
              canDelete && {
                label: "Löschen",
                onClick: () => props.onStatisticDeleteClicked(),
                startDecorator: <Delete />,
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
