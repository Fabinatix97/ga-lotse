/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Edit, KeyboardArrowDown, Print } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";

import {
  ApiInspectionSample,
  ApiInspectionSampleEvaluatingActor,
  ApiInspectionSamplePreclassification,
} from "@eshg/inspection-api";
import { DetailsItem } from "@eshg/lib-employee-portal";
import {
  DetailsColumn,
  DetailsList,
  formatDateTime,
  useSnackbar,
} from "@eshg/lib-portal";

import { useUpdateSampleMeasurementParameterValue } from "@/lib/businessModules/inspection/api/mutations/sample";
import { useInspectEditSampleSidebar } from "@/lib/businessModules/inspection/components/inspection/measurements/InspectionEditSampleSidebar";
import {
  translateInspectionSampleEvaluationType,
  translateInspectionSamplePreclassification,
  translateInspectionSampleType,
} from "@/lib/businessModules/inspection/shared/enums";

interface MeasurementsTileItemProps {
  sample: ApiInspectionSample;
  procedureId: string;
}

export function Sample({
  sample,
  procedureId,
}: Readonly<MeasurementsTileItemProps>) {
  const [open, setOpen] = useState(false);
  const snackbar = useSnackbar();
  const inspectionEditSampleSidebar = useInspectEditSampleSidebar();
  const { mutateAsync: updateSampleMeasurementParameterValue } =
    useUpdateSampleMeasurementParameterValue();

  function handleOpenEditSidebar(
    e: React.MouseEvent,
    sample: ApiInspectionSample,
  ) {
    e.stopPropagation();
    inspectionEditSampleSidebar.open({
      procedureId: procedureId,
      sample: sample,
      sampleId: sample.sampleId,
    });
  }

  function handleOpenCloseAccordion(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(!open);
  }

  function handlePrint(e: React.MouseEvent) {
    e.stopPropagation();
    alert("Label drucken");
  }

  async function handleEdit(value: string, index: number) {
    if (sample.measurementParameters[index] && !isNaN(Number(value))) {
      await updateSampleMeasurementParameterValue(
        {
          inspectionId: procedureId,
          sampleId: sample.sampleId,
          measurementParameterId:
            sample.measurementParameters[index].externalId,
          apiUpdateInspectionSampleMeasurementParameterValueRequest: {
            value: Number(value),
          },
        },
        {
          onSuccess: () => {
            snackbar.confirmation("Probe wurde geändert.");
          },
        },
      );
    }
  }

  function getPreclassificationColor(
    preclassification?: ApiInspectionSamplePreclassification,
  ) {
    switch (preclassification) {
      case "TOO_HIGH":
      case "TOO_LOW":
        return "#C41C1C";
      case "WITHIN_NORM":
        return "#51BC51";
      default:
        return "#636B74";
    }
  }

  function getPreclassificationBorderColor(
    preclassification?: ApiInspectionSamplePreclassification,
  ) {
    switch (preclassification) {
      case "TOO_HIGH":
      case "TOO_LOW":
        return "#C41C1C";
      case "WITHIN_NORM":
        return "#51BC51";
      default:
        return "transparent";
    }
  }

  function getSampleEvaluatingActor(
    actor?: ApiInspectionSampleEvaluatingActor,
  ) {
    switch (actor?.type) {
      case "InspectionSampleContact":
        return actor.contact.name;
      case "InspectionSampleInspectedFacility":
        return actor.facilityFileState.name;
      case "InspectionSampleUser":
        return actor.user.firstName + " " + actor.user.lastName;
      default:
        return "-";
    }
  }

  const initObject: ApiInspectionSample = sample;

  return (
    <AccordionGroup variant="soft" color="neutral">
      <Accordion
        sx={{
          borderTopLeftRadius: "lg",
          borderTopRightRadius: "lg",
          overflow: "hidden",
        }}
        expanded={open}
      >
        <AccordionSummary
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            minHeight: 68,
            "& .MuiAccordionSummary-content": {
              my: 1,
            },
            "& .MuiAccordionSummary-indicator": {
              display: "none",
            },
          }}
        >
          <Grid
            container
            direction={{ lg: "row" }}
            columns={3}
            sx={{
              height: 68,
              flexGrow: 1,
            }}
          >
            <Grid
              lg={1}
              sx={{
                alignContent: "center",
              }}
            >
              <Typography component="span" level="title-lg">
                {initObject.pointOfWithdrawal}
              </Typography>
            </Grid>
            <Grid
              lg={1}
              sx={{
                alignContent: "center",
              }}
            >
              <Typography component="span" level="title-sm">
                {initObject.nameOfSamplingPoint}
              </Typography>
            </Grid>
            <Grid
              lg={1}
              sx={{
                alignContent: "center",
                justifyItems: "flex-end",
              }}
            >
              <Stack direction="row" spacing={1}>
                <Button
                  color="primary"
                  variant="outlined"
                  startDecorator={<Print />}
                  onClick={(e) => {
                    handlePrint(e);
                  }}
                >
                  Label drucken
                </Button>

                <IconButton
                  color="primary"
                  variant="outlined"
                  aria-label="Proben bearbeiten"
                  onClick={(e) => {
                    handleOpenEditSidebar(e, initObject);
                  }}
                >
                  <Edit />
                </IconButton>

                <IconButton
                  color="neutral"
                  variant="plain"
                  aria-label="öffnen-schließen details"
                  sx={{
                    transition: "transform 0.3s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  onClick={(e) => {
                    handleOpenCloseAccordion(e);
                  }}
                >
                  <KeyboardArrowDown />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </AccordionSummary>
        {open && <Divider sx={{ marginBottom: 2 }} />}
        <AccordionDetails>
          <DetailsList>
            <Stack
              direction={{ md: "row" }}
              gap={3}
              divider={<Divider />}
              width="100%"
            >
              <DetailsColumn>
                <DetailsItem
                  label="Art"
                  value={translateInspectionSampleType(sample.typeOfSample)}
                />
                <DetailsItem
                  label="Entnahmestelle"
                  value={initObject.pointOfWithdrawal}
                />
                <DetailsItem
                  label="Name der Probeentnahme"
                  value={initObject.nameOfSamplingPoint}
                />
              </DetailsColumn>
              <DetailsColumn>
                <DetailsItem
                  label="Zeitpunkt der Probenahme"
                  value={
                    initObject?.timeOfSampling
                      ? formatDateTime(initObject.timeOfSampling)
                      : "-"
                  }
                />

                <DetailsItem
                  label="Erstellungszeitpunkt"
                  value={
                    initObject?.timeOfSampling
                      ? formatDateTime(initObject.timeOfSampling)
                      : "-"
                  }
                />
                <DetailsItem
                  label="Zeipunkt der Auswertung"
                  value={
                    initObject?.timeOfEvaluation
                      ? formatDateTime(initObject.timeOfEvaluation)
                      : "-"
                  }
                />
              </DetailsColumn>
              <DetailsColumn>
                <DetailsItem
                  label="Probenehmer"
                  value={getSampleEvaluatingActor(initObject.samplingActor)}
                />
                <DetailsItem
                  label="Auswerter"
                  value={getSampleEvaluatingActor(initObject.evaluatingActor)}
                />
                <DetailsItem
                  label="Auswertungsart"
                  value={translateInspectionSampleEvaluationType(
                    initObject.evaluationType,
                  )}
                />
              </DetailsColumn>
            </Stack>
            <Divider sx={{ marginTop: 3, marginBottom: 2 }} />
            <DetailsColumn>
              <Stack direction={{ md: "column" }} gap={2} width="100%">
                {initObject.measurementParameters.map((parameter, index) => (
                  <Grid
                    key={"measurementParameter-" + index}
                    container
                    direction={{ lg: "row" }}
                    columns={3}
                    sx={{
                      height: 68,
                      borderRight: "10px solid",
                      borderColor: getPreclassificationBorderColor(
                        parameter.preclassification,
                      ),
                      borderRadius: "8px",
                      paddingLeft: 2,
                      backgroundColor: "white",
                      flexGrow: 1,
                    }}
                  >
                    <Grid
                      lg={1}
                      sx={{
                        alignContent: "center",
                      }}
                    >
                      <Typography component="span" level="body-md">
                        {parameter.parameterName}
                      </Typography>
                    </Grid>
                    <Grid
                      lg={1}
                      sx={{
                        alignContent: "center",
                      }}
                    >
                      <Stack
                        direction={{ md: "row" }}
                        gap={2}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Input
                          name={"measurementValue-" + index}
                          type="text"
                          value={parameter.measurementValue}
                          readOnly={parameter.measurementValue !== undefined}
                          onBlur={(event) =>
                            handleEdit(event.target.value, index)
                          }
                        />
                        <Typography component="span" level="body-md">
                          {parameter.unit}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid
                      lg={1}
                      sx={{
                        alignContent: "center",
                        justifyItems: "flex-end",
                        paddingRight: 3,
                      }}
                    >
                      <Typography
                        component="span"
                        level="body-md"
                        sx={{
                          color: getPreclassificationColor(
                            parameter.preclassification,
                          ),
                        }}
                      >
                        {translateInspectionSamplePreclassification(
                          parameter.preclassification ??
                            ApiInspectionSamplePreclassification.NoNormSpecified,
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            </DetailsColumn>
          </DetailsList>
        </AccordionDetails>
      </Accordion>
    </AccordionGroup>
  );
}
