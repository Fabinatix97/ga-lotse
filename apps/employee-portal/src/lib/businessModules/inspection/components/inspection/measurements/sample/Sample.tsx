/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  CheckCircleOutlined,
  Delete,
  DeleteOutlined,
  EditOutlined,
  FileDownloadOutlined,
  KeyboardArrowDown,
  MoreVert,
  PendingOutlined,
  PrintOutlined,
  ReportGmailerrorredOutlined,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Chip,
  Divider,
  Dropdown,
  Grid,
  IconButton,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";

import {
  ApiInspFacility,
  ApiInspectionSample,
  ApiInspectionSampleEvaluatingActor,
  ApiInspectionSamplePreclassification,
} from "@eshg/inspection-api";
import { DetailsItem, useConfirmationDialog } from "@eshg/lib-employee-portal";
import {
  DebouncedInput,
  DetailsColumn,
  DetailsList,
  formatDateTime,
} from "@eshg/lib-portal";

import {
  useDeleteSample,
  useDeleteSampleMeasurementParameter,
  useUpdateSampleMeasurementParameterValue,
} from "@/lib/businessModules/inspection/api/mutations/sample";
import { useInspectionEditSampleSidebar } from "@/lib/businessModules/inspection/components/inspection/measurements/InspectionEditSampleSidebar";
import {
  translateInspectionSampleEvaluationType,
  translateInspectionSamplePreclassification,
  translateInspectionSampleType,
} from "@/lib/businessModules/inspection/shared/enums";

interface MeasurementsTileItemProps {
  sample: ApiInspectionSample;
  procedureId: string;
  sampleIndex: number;
  facility: ApiInspFacility;
  classification: "SUSPICIOUS" | "PENDING" | "NO_NORM" | "OK";
  showOnlyConspicuousParameters: boolean;
}

export function Sample({
  sample,
  procedureId,
  sampleIndex,
  facility,
  classification,
  showOnlyConspicuousParameters,
}: Readonly<MeasurementsTileItemProps>) {
  const [open, setOpen] = useState(false);
  const inspectionEditSampleSidebar = useInspectionEditSampleSidebar();
  const { mutateAsync: updateSampleMeasurementParameterValue } =
    useUpdateSampleMeasurementParameterValue();
  const { mutateAsync: deleteSampleParameter } =
    useDeleteSampleMeasurementParameter();
  const { mutateAsync: deleteSample } = useDeleteSample();

  const { openCancelDialog } = useConfirmationDialog();

  function handleOpenEditSidebar(e: React.MouseEvent) {
    e.stopPropagation();
    inspectionEditSampleSidebar.open({
      procedureId: procedureId,
      sample: sample,
      facility: facility,
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

  function handleDownloadProtocol(e: React.MouseEvent) {
    e.stopPropagation();
    alert("Protokoll herunterladen");
  }

  function handleDownloadAccompanyingNote(e: React.MouseEvent) {
    e.stopPropagation();
    alert("Begleitschein herunterladen");
  }

  function handleDeleteSample(e: React.MouseEvent) {
    e.stopPropagation();
    openCancelDialog({
      title: "Probe löschen",
      description: `Möchten Sie die Probe ${sample.pointOfWithdrawal} und die zugehörigen Messwerten unwiderruflich löschen?`,
      cancelLabel: "Abbrechen",
      confirmLabel: "Löschen",
      onConfirm: async () => {
        await deleteSample({
          sampleId: sample.sampleId,
          inspectionId: procedureId,
        });
      },
    });
  }

  function handleDeleteSampleParameter(
    e: React.MouseEvent,
    parameterId: string,
    parameterName: string,
  ) {
    e.stopPropagation();
    openCancelDialog({
      title: "Messparameter löschen",
      description: `Möchten Sie den Messparameter ${parameterName} und den zugehörigen Messwert unwiderruflich löschen?`,
      cancelLabel: "Abbrechen",
      confirmLabel: "Löschen",
      onConfirm: async () => {
        await deleteSampleParameter({
          inspectionId: procedureId,
          sampleId: sample.sampleId,
          measurementParameterId: parameterId,
        });
      },
    });
  }

  async function handleEdit(value: string | number | undefined, index: number) {
    if (sample.measurementParameters[index]) {
      await updateSampleMeasurementParameterValue({
        inspectionId: procedureId,
        sampleId: sample.sampleId,
        measurementParameterId: sample.measurementParameters[index].externalId,
        apiUpdateInspectionSampleMeasurementParameterValueRequest: {
          value:
            value !== "" && !isNaN(Number(value)) ? Number(value) : undefined,
        },
      });
    }
  }

  function getParameterPreclassificationColor(
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

  function getParameterPreclassificationBorderColor(
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
        return "";
    }
  }

  function getSampleClassificationColor() {
    switch (classification) {
      case "SUSPICIOUS":
        return "danger";
      case "OK":
        return "success";
      case "PENDING":
        return "primary";
      default:
        return "neutral";
    }
  }

  function getSampleClassificationText() {
    switch (classification) {
      case "SUSPICIOUS":
        return "Auffälligkeiten";
      case "OK":
        return "Normbereich";
      case "PENDING":
        return "Bewertung ausstehend";
      default:
        return null;
    }
  }

  function getSampleClassificationIcon() {
    switch (classification) {
      case "SUSPICIOUS":
        return <ReportGmailerrorredOutlined />;
      case "OK":
        return <CheckCircleOutlined />;
      case "PENDING":
        return <PendingOutlined />;
      default:
        return null;
    }
  }

  const initObject: ApiInspectionSample = {
    ...sample,
    measurementParameters: showOnlyConspicuousParameters
      ? sample.measurementParameters.filter(
          (p) =>
            p.preclassification === "TOO_HIGH" ||
            p.preclassification === "TOO_LOW",
        )
      : sample.measurementParameters,
  };

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
                {"Probe " + (sampleIndex + 1)}
              </Typography>
            </Grid>
            <Grid
              lg={1}
              sx={{
                alignContent: "center",
              }}
            >
              {classification !== "NO_NORM" && (
                <Chip
                  data-testid={"sampleClassificationChip-" + sampleIndex}
                  color={getSampleClassificationColor()}
                  variant="outlined"
                  sx={{ backgroundColor: "transparent" }}
                  startDecorator={getSampleClassificationIcon()}
                >
                  {getSampleClassificationText()}
                </Chip>
              )}
            </Grid>
            <Grid
              lg={1}
              sx={{
                alignContent: "center",
                justifyItems: "flex-end",
              }}
            >
              <Stack direction="row" spacing={1}>
                <Dropdown>
                  <MenuButton
                    data-testid={"dropdown-button-sample-" + sampleIndex}
                    aria-label="Proben menü"
                    slots={{ root: IconButton }}
                    slotProps={{
                      root: { variant: "outlined", color: "primary" },
                    }}
                  >
                    <MoreVert />
                  </MenuButton>
                  <Menu>
                    <MenuItem
                      aria-label="Probe bearbeiten"
                      onClick={(e) => {
                        handleOpenEditSidebar(e);
                      }}
                    >
                      <ListItemDecorator>
                        <EditOutlined />
                      </ListItemDecorator>{" "}
                      Bearbeiten
                    </MenuItem>
                    <MenuItem
                      aria-label="Label drucken"
                      onClick={(e) => {
                        handlePrint(e);
                      }}
                    >
                      <ListItemDecorator>
                        <PrintOutlined />
                      </ListItemDecorator>{" "}
                      Label drucken
                    </MenuItem>
                    <MenuItem
                      aria-label="Protokoll herunterladen"
                      onClick={(e) => {
                        handleDownloadProtocol(e);
                      }}
                    >
                      <ListItemDecorator>
                        <FileDownloadOutlined />
                      </ListItemDecorator>{" "}
                      Protokoll herunterladen
                    </MenuItem>
                    <MenuItem
                      aria-label="Begleitschein herunterladen"
                      onClick={(e) => {
                        handleDownloadAccompanyingNote(e);
                      }}
                    >
                      <ListItemDecorator>
                        <FileDownloadOutlined />
                      </ListItemDecorator>{" "}
                      Begleitschein herunterladen
                    </MenuItem>
                    <MenuItem
                      aria-label="Probe löschen"
                      sx={{
                        color: "#C41C1C",
                        "&:hover": {
                          color: "#C41C1C",
                        },
                      }}
                      onClick={(e) => {
                        handleDeleteSample(e);
                      }}
                    >
                      <ListItemDecorator sx={{ color: "#C41C1C" }}>
                        <Delete sx={{ color: "#C41C1C" }} />
                      </ListItemDecorator>{" "}
                      Löschen
                    </MenuItem>
                  </Menu>
                </Dropdown>

                <IconButton
                  data-testid={"sample-" + sampleIndex}
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
              <Stack
                data-testid="measurementParameterList"
                direction={{ md: "column" }}
                gap={2}
                width="100%"
              >
                {initObject.measurementParameters.map((parameter, index) => (
                  <Grid
                    key={"measurementParameter-" + index}
                    container
                    direction={{ lg: "row", sm: "column" }}
                    columns={2}
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    <Grid
                      container
                      direction={{ lg: "row", sm: "column" }}
                      columns={3}
                      sx={{
                        height: 68,
                        borderRight: "10px solid",
                        borderColor: getParameterPreclassificationBorderColor(
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
                          <DebouncedInput
                            data-testid={"measurementParameterInput-" + index}
                            name={"measurementValue-" + index}
                            inputMode="numeric"
                            type="number"
                            defaultValue={parameter.measurementValue}
                            onChange={(value) => handleEdit(value, index)}
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
                          data-testid={
                            "measurementParameterClassification-" + index
                          }
                          component="span"
                          level="body-md"
                          sx={{
                            color: getParameterPreclassificationColor(
                              parameter.preclassification,
                            ),
                          }}
                        >
                          {translateInspectionSamplePreclassification(
                            parameter.preclassification,
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                    {initObject.measurementParameters.length >= 2 && (
                      <Grid
                        sx={{
                          alignContent: "center",
                          justifyItems: "flex-end",
                          paddingLeft: 2,
                        }}
                      >
                        <IconButton
                          data-testid={"measurementParameterDelete-" + index}
                          aria-label="Löschen"
                          sx={{
                            border: "solid",
                            borderColor: "#F09898",
                            borderRadius: "var(--joy-radius-sm)",
                            borderWidth: "1px",
                            backgroundColor: "white",
                            height: "32px",
                            width: "32px",
                            alignSelf: "flex-end",
                          }}
                          onClick={(e) =>
                            handleDeleteSampleParameter(
                              e,
                              parameter.externalId,
                              parameter.parameterName,
                            )
                          }
                        >
                          <DeleteOutlined color="danger" />
                        </IconButton>
                      </Grid>
                    )}
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
