/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import {
  AddchartOutlined,
  Delete,
  Download,
  Edit,
  FileCopy,
  Menu,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { isPlainObject } from "remeda";

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
  canUpdateEvaluation: boolean;
  anonymized: boolean;
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy: string;
  onAnalysisCreateClicked: () => void;
  onDataBasisUpdateClicked: () => void;
  onNameChangeClicked: () => void;
  onEvaluationDeleteClicked: () => void;
  onEvaluationDuplicateClicked: () => void;
  onSaveEvaluationTemplateClicked: () => void;
  onDataExport: () => Promise<void>;
}

export function DetailsInformationCard(props: DetailsInformationCardProps) {
  const canExportData = props.anonymized;

  const { canDelete, canUpdateEvaluation, canWrite } = props;

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
              onClick={props.onAnalysisCreateClicked}
            >
              Analyse erstellen
            </Button>
            {props.canUpdateEvaluation && (
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
        (canUpdateEvaluation || canDelete || canWrite || canExportData) && (
          <ActionsMenu
            actionItems={[
              canUpdateEvaluation && {
                label: "Name ändern",
                onClick: () => props.onNameChangeClicked(),
                startDecorator: <Edit />,
              },
              canWrite && {
                label: "Als Vorlage speichern",
                onClick: () => props.onSaveEvaluationTemplateClicked(),
                startDecorator: <Menu />,
              },
              canWrite && {
                label: "Duplizieren",
                onClick: () => props.onEvaluationDuplicateClicked(),
                startDecorator: <FileCopy />,
              },
              canExportData && {
                label: "Daten exportieren",
                onClick: () => props.onDataExport(),
                startDecorator: <Download />,
              },
              canDelete &&
                ({
                  label: "Löschen",
                  onClick: () => props.onEvaluationDeleteClicked(),
                  startDecorator: <Delete />,
                  color: "danger",
                } as const),
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
