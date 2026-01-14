/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import {
  AffectedPersonSection,
  CurrentHealthConditionSection,
  HealthFitnessAndDisabilitySection,
  MedicalHistorySection,
  RetirementSection,
} from "@eshg/official-medical-service";

import { AnamnesisSidePanel } from "@/lib/businessModules/officialMedicalService/components/personalArea/anamnesis/AnamnesisSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

interface AnamnesisWrapperProps {
  stepIndex: number;
  setStepIndex: Dispatch<SetStateAction<number>>;
  focusTitle: () => void;
}

export function AnamnesisWrapper(props: AnamnesisWrapperProps) {
  return (
    <TwoColumnGrid
      content={
        <ContentSheet sx={{ p: 0 }}>
          {props.stepIndex === 0 ? (
            <Stack direction="column">
              <InfoBox />
              <AffectedPersonSection citizen />
              <HealthFitnessAndDisabilitySection citizen />
              <RetirementSection citizen />
            </Stack>
          ) : props.stepIndex === 1 ? (
            <MedicalHistorySection citizen />
          ) : (
            <CurrentHealthConditionSection citizen />
          )}
        </ContentSheet>
      }
      sidePanel={<AnamnesisSidePanel {...props} />}
    />
  );
}

function InfoBox() {
  const { t } = useTranslation("officialMedicalService/anamnesis");

  return (
    <Sheet
      color="primary"
      variant="soft"
      sx={{
        display: "flex",
        gap: 1,
        p: 2,
        m: 3,
      }}
    >
      <InfoOutlined />
      <Typography>{t("content.infoBox")}</Typography>
    </Sheet>
  );
}
