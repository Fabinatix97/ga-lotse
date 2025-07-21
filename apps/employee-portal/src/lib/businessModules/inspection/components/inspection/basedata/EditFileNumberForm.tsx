/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OpenInNewOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  DialogTitle,
  List,
  ListItem,
  Radio,
  Sheet,
  Stack,
  Typography,
  accordionSummaryClasses,
} from "@mui/joy";
import { Formik } from "formik";
import { Ref, useId } from "react";
import { isDefined, isEmpty, isNonNullish } from "remeda";

import {
  ApiGetFileNumberCollisionsResponse,
  ApiProcedureStatus,
} from "@eshg/inspection-api";
import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  ExternalLinkIconButton,
  NumberField,
  OptionalFieldValue,
  RadioGroupField,
  formatDate,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";

import { translateProcedureStatus } from "@/lib/baseModule/api/procedures/enums";
import { theme } from "@/lib/baseModule/theme/theme";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

type EditFileNumberOptions = "KEEP" | "DEFINE";

const MIN_SUFFIX = 1;
const MAX_SUFFIX = 99;
export interface EditFileNumberFormValues {
  fileNumberSuffix: OptionalFieldValue<number>;
  fileNumberSuffixSelect: EditFileNumberOptions;
}

interface EditFileNumberFormProps {
  fileNumber: string;
  fileNumberCollisions?: ApiGetFileNumberCollisionsResponse;
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: EditFileNumberFormValues) => Promise<void>;
  onBack?: () => void;
  title: string;
}

export function EditFileNumberForm({
  fileNumberCollisions,
  fileNumber,
  ...props
}: Readonly<EditFileNumberFormProps>) {
  const initFileNumberSuffix = getFileNumberSuffix(fileNumber);

  const initialValues: EditFileNumberFormValues = {
    fileNumberSuffix: isDefined(initFileNumberSuffix)
      ? parseInt(initFileNumberSuffix)
      : "",
    fileNumberSuffixSelect: isDefined(initFileNumberSuffix) ? "DEFINE" : "KEEP",
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting, values }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent
            title={
              <DialogTitle level="h2" component="h1">
                <Stack direction="column">
                  <Typography level="h2" component="span">
                    {props.title}
                  </Typography>
                  <Typography
                    level="h2"
                    component="span"
                    fontWeight={theme.typography["body-md"].fontWeight}
                  >
                    {fileNumber}
                  </Typography>
                </Stack>
              </DialogTitle>
            }
          >
            <Stack gap={3}>
              <RadioGroupField
                name="fileNumberSuffixSelect"
                label={
                  <Typography level="title-md" component="span">
                    Wie möchten Sie das Aktenzeichen festlegen?
                  </Typography>
                }
              >
                <Radio
                  color="primary"
                  value="KEEP"
                  label="Aktenzeichen ohne Erweiterung nutzen"
                />
                <Radio
                  color="primary"
                  value="DEFINE"
                  label="Aktenzeichen-Erweiterung definieren"
                />
                {values.fileNumberSuffixSelect === "DEFINE" && (
                  <NumberField
                    name="fileNumberSuffix"
                    label="Aktenzeichen"
                    required="Bitte ein Aktenzeichensuffix angeben"
                    min={MIN_SUFFIX}
                    max={MAX_SUFFIX}
                    startDecorator={
                      <Typography level="title-md" component="span">
                        {getFileNumberPrefix(fileNumber)}-
                      </Typography>
                    }
                    validate={validateIntegerAnd(
                      validateRange(MIN_SUFFIX, MAX_SUFFIX),
                    )}
                    fieldSx={{
                      paddingLeft: "1.875em",
                      paddingTop: 1,
                    }}
                  />
                )}
              </RadioGroupField>
              <FileNumberSearchResult
                fileNumberCollisions={fileNumberCollisions}
                fileNumber={fileNumber}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={props.onCancel}
              onBack={props.onBack}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function getFileNumberCollisionName(fileNumber: string, groupName: string) {
  const fileNumberPrefix = getFileNumberPrefix(fileNumber);
  if (groupName === "0") {
    return fileNumberPrefix;
  }
  return `${fileNumberPrefix}-${groupName}`;
}

function getFileNumberSuffix(fileNumber: string) {
  if (fileNumber === undefined) {
    return;
  }
  const stringArr = fileNumber.split("-");
  if (stringArr.length <= 3) {
    return undefined;
  }
  return stringArr.at(-1);
}

function getFileNumberPrefix(fileNumber: string) {
  if (fileNumber === undefined) {
    return;
  }
  const stringArr = fileNumber.split("-");
  if (stringArr.length <= 3) {
    return fileNumber;
  }
  return fileNumber.substring(
    0,
    fileNumber.lastIndexOf(`-${stringArr.at(-1)}`),
  );
}

function FileNumberSearchResult({
  fileNumberCollisions,
  fileNumber,
}: {
  fileNumberCollisions?: ApiGetFileNumberCollisionsResponse;
  fileNumber: string;
}) {
  const accordionId = useId();

  if (
    isDefined(fileNumberCollisions) &&
    !isEmpty(fileNumberCollisions.collisions)
  ) {
    return (
      <Stack direction="column" gap={2} data-testid="existingProcedures">
        <Stack direction="column" gap={2}>
          <Typography level="title-md" id={accordionId}>
            Bereits vorhandene Vorgänge zum Aktenzeichen:
          </Typography>
          <AccordionGroup
            disableDivider
            sx={{
              gap: 2,
              [`& .${accordionSummaryClasses.button}:hover`]: {
                backgroundColor: "transparent",
                borderRadius: theme.radius.md,
              },
            }}
            aria-describedby={accordionId}
          >
            {Object.entries(fileNumberCollisions.collisions).map(
              ([groupName, facilities]) => (
                <Accordion
                  key={groupName}
                  defaultExpanded={
                    fileNumber ===
                    getFileNumberCollisionName(fileNumber, groupName)
                  }
                  sx={{
                    backgroundColor: theme.vars.palette.background.surface,
                    borderRadius: theme.radius.md,
                    borderColor: theme.vars.palette.neutral.outlinedBorder,
                    borderStyle: "solid",
                    borderWidth: "1px",
                  }}
                >
                  <AccordionSummary
                    sx={{
                      flex: 1,
                      fontWeight: theme.fontWeight.lg,
                    }}
                  >
                    {getFileNumberCollisionName(fileNumber, groupName)}
                  </AccordionSummary>
                  <AccordionDetails slotProps={{ content: { sx: { gap: 1 } } }}>
                    {facilities.map((facility, index) => (
                      <Sheet
                        key={`${groupName}${facility.facilityName}`}
                        sx={{
                          backgroundColor: theme.vars.palette.background.level2,
                          borderStyle: "none",
                          borderRadius: theme.radius.md,
                          paddingY: 1,
                          paddingX: 2,
                        }}
                        aria-label={`Einrichtung ${index + 1}`}
                      >
                        <Stack direction="row">
                          <List
                            sx={{
                              "--List-gap": "-8px",
                            }}
                          >
                            <ListItem sx={{ paddingBlock: 0 }}>
                              {facility.facilityName}
                            </ListItem>
                            {isNonNullish(facility.dayOfInspection) && (
                              <ListItem sx={{ paddingBlock: 0 }}>
                                {formatDate(new Date(facility.dayOfInspection))}
                              </ListItem>
                            )}
                            <ListItem sx={{ paddingBlock: 0 }}>
                              {translateProcedureStatus(
                                facility.inspectionStatus,
                              )}
                            </ListItem>
                          </List>
                          <ExternalLinkIconButton
                            aria-label="Vorgang öffnen"
                            color="primary"
                            variant="outlined"
                            size="md"
                            sx={{
                              alignSelf: "center",
                            }}
                            href={
                              facility.inspectionStatus !==
                              ApiProcedureStatus.Draft
                                ? routes.procedures.basedata(
                                    facility.inspectionId,
                                  )
                                : routes.procedures.new(facility.inspectionId)
                            }
                            openInNewTab
                          >
                            <OpenInNewOutlined size="xl" />
                          </ExternalLinkIconButton>
                        </Stack>
                      </Sheet>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ),
            )}
          </AccordionGroup>
        </Stack>
      </Stack>
    );
  }
  return (
    <Typography level="title-md">
      Keine Vorgänge zum Aktenzeichen gefunden
    </Typography>
  );
}
