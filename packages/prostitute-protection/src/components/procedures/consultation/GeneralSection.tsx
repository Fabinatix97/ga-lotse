/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack, Typography } from "@mui/joy";

import { CheckboxField } from "@eshg/lib-portal";

import { CONSULTATION_FIELD_NAME } from "../../../shared/constants";

import { SectionGrid } from "./SectionGrid";

export function GeneralSection() {
  return (
    <SectionGrid defaultColumn={1} sx={{ mt: 6 }}>
      <Typography level="h3">Beratungsinhalte</Typography>
      <Grid container spacing={4}>
        <Grid component={Stack} gap={4} xs={12} md={6}>
          <CheckboxField
            name="general.legalAdvice"
            label={CONSULTATION_FIELD_NAME.legalAdvice}
          />
          <CheckboxField
            name="general.healthAndSocialInsurance"
            label={CONSULTATION_FIELD_NAME.healthAndSocialInsurance}
          />
          <CheckboxField
            name="general.counselingServices"
            label={CONSULTATION_FIELD_NAME.counselingServices}
          />
          <CheckboxField
            name="general.helpInEmergencies"
            label={CONSULTATION_FIELD_NAME.helpInEmergencies}
          />
          <CheckboxField
            name="general.taxObligation"
            label={CONSULTATION_FIELD_NAME.taxObligation}
          />
        </Grid>
        <Grid component={Stack} gap={4} xs={12} md={6}>
          <CheckboxField
            name="general.counselingNeedClearing"
            label={CONSULTATION_FIELD_NAME.counselingNeedClearing}
          />
          <CheckboxField
            name="general.informationMaterial"
            label={CONSULTATION_FIELD_NAME.informationMaterial}
          />
          <CheckboxField
            name="general.emergencyCoercionSituation"
            label={CONSULTATION_FIELD_NAME.emergencyCoercionSituation}
          />
          <CheckboxField
            name="general.diseasePrevention"
            label={CONSULTATION_FIELD_NAME.diseasePrevention}
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={4} sx={{ mb: 1 }}>
        <Grid component={Stack} gap={4} xs={12} md={6}>
          <CheckboxField
            name="general.contraception"
            label={CONSULTATION_FIELD_NAME.contraception}
          />
          <CheckboxField
            name="general.pregnancy"
            label={CONSULTATION_FIELD_NAME.pregnancy}
          />
        </Grid>
        <Grid component={Stack} gap={4} xs={12} md={6}>
          <CheckboxField
            name="general.alcoholDrugUse"
            label={CONSULTATION_FIELD_NAME.alcoholDrugUse}
          />
          <CheckboxField
            name="general.referralParagraph19"
            label={CONSULTATION_FIELD_NAME.referralParagraph19}
          />
        </Grid>
      </Grid>
    </SectionGrid>
  );
}
