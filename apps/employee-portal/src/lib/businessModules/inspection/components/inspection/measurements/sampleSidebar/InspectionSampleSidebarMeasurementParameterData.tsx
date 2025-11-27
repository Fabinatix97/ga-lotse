/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Stack } from "@mui/joy";

import { IconButton } from "@eshg/lib-employee-portal";
import { FieldArrayWithFocus as FieldArray } from "@eshg/lib-portal";

import { InspectionSampleSidebarFormType } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarHelper";
import { MeasurementParameterField } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/MeasurementParameterField";

interface InspectionSampleSidebarMeasurementParameterDataProps {
  values: InspectionSampleSidebarFormType;
}

export function InspectionSampleSidebarMeasurementParameterData({
  values,
}: InspectionSampleSidebarMeasurementParameterDataProps) {
  return (
    <Grid container spacing={1} sx={{ display: "grid" }}>
      <FieldArray
        valueLength={values.measurementParameters.length}
        name="measurementParameters"
      >
        {({ push, remove }) => (
          <>
            <Box
              sx={{
                display: "grid",
                flexDirection: "column",
                gap: 2,
                paddingBottom: 2,
                paddingTop: 1,
              }}
            >
              {values.measurementParameters.map((element, elementIndex) => (
                <Stack key={elementIndex} direction="row" spacing={2}>
                  <MeasurementParameterField
                    data-testid={
                      "measurementParameterAutocomplete-" + elementIndex
                    }
                    label={`${elementIndex + 1}. Messparameter`}
                    name={`measurementParameters.${elementIndex}`}
                    placeholder={`Messparameter ${elementIndex + 1} auswählen`}
                    required={`Messparameter ${elementIndex + 1} auswählen`}
                  />
                  {values.measurementParameters.length >= 2 && (
                    <IconButton
                      label="Löschen"
                      aria-label="Löschen"
                      sx={{
                        borderColor:
                          "var(--global--color-danger-outlined-border)",
                        borderRadius: "var(--joy-radius-sm)",
                        borderWidth: "1px",
                        height: "36px",
                        width: "36px",
                        alignSelf: "flex-end",
                      }}
                      onClick={() => remove(elementIndex)}
                    >
                      <DeleteOutlined color="danger" />
                    </IconButton>
                  )}
                </Stack>
              ))}
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                justifyContent: "flex-end",
                display: "flex",
              }}
            >
              <Button
                variant="plain"
                startDecorator={<Add />}
                sx={{ alignSelf: "flex-end" }}
                onClick={() => push("")}
              >
                Messparameter hinzufügen
              </Button>
            </Box>
          </>
        )}
      </FieldArray>
    </Grid>
  );
}
