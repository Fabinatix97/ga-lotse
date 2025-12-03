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
            name="legalAdvices"
            label={CONSULTATION_FIELD_NAME.legalAdvices}
          />
          <CheckboxField
            name="healthAndSocialInsurance"
            label={CONSULTATION_FIELD_NAME.healthAndSocialInsurance}
          />
          <CheckboxField
            name="consultingServices"
            label={CONSULTATION_FIELD_NAME.consultingServices}
          />
          <CheckboxField
            name="emergencyHelp"
            label={CONSULTATION_FIELD_NAME.emergencyHelp}
          />
          <CheckboxField
            name="taxLiability"
            label={CONSULTATION_FIELD_NAME.taxLiability}
          />
        </Grid>
        <Grid component={Stack} gap={4} xs={12} md={6}>
          <CheckboxField
            name="clearing"
            label={CONSULTATION_FIELD_NAME.clearing}
          />
          <CheckboxField
            name="informationMaterial"
            label={CONSULTATION_FIELD_NAME.informationMaterial}
          />
          <CheckboxField
            name="predicament"
            label={CONSULTATION_FIELD_NAME.predicament}
          />
          <CheckboxField
            name="diseasePrevention"
            label={CONSULTATION_FIELD_NAME.diseasePrevention}
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={4} sx={{ mb: 1 }}>
        <Grid component={Stack} gap={4} xs={12} md={6}>
          <CheckboxField
            name="birthControl"
            label={CONSULTATION_FIELD_NAME.birthControl}
          />
          <CheckboxField
            name="pregnancy"
            label={CONSULTATION_FIELD_NAME.pregnancy}
          />
        </Grid>
        <Grid component={Stack} gap={4} xs={12} md={6}>
          <CheckboxField
            name="alcoholAndDrugUsage"
            label={CONSULTATION_FIELD_NAME.alcoholAndDrugUsage}
          />
          <CheckboxField
            name="referral"
            label={CONSULTATION_FIELD_NAME.referral}
          />
        </Grid>
      </Grid>
    </SectionGrid>
  );
}
