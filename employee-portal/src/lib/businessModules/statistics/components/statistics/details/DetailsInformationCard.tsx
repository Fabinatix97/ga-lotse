/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { AddchartOutlined } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";

import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import {
  LabelValuePair,
  StyledValue,
} from "@/lib/shared/components/infoTile/LabelValuePair";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";

export interface DetailsInformationCardProps {
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy: string;
  onEvaluationCreateClicked: () => void;
  onDataBasisUpdateClicked: () => void;
}

export function DetailsInformationCard(props: DetailsInformationCardProps) {
  const canWrite = useStatisticRoleChecks().canWrite();

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
              data-testid="create-evaluation-button"
            >
              Auswertung erstellen
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
