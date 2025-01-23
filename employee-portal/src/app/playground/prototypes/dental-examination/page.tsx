/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import {
  DocumentScanner,
  KeyboardArrowUpOutlined,
  MedicalServicesOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Sheet,
  Stack,
  SvgIcon,
  SvgIconProps,
  Textarea,
  ToggleButtonGroup,
  Typography,
  styled,
} from "@mui/joy";
import { ReactNode, RefObject, createRef, useState } from "react";
import { isDefined, isNullish } from "remeda";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { ContentPanelTitle } from "@/lib/shared/components/contentPanel/ContentPanelTitle";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { PersonToolbarHeader } from "@/lib/shared/components/layout/PersonToolbarHeader";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

const PRIMARY_TOOTH_OFFSET = 40;

interface JawQuadrant {
  quadrantNumber: QuadrantNumber;
  teeth: Tooth[];
}

type QuadrantNumber = 1 | 2 | 3 | 4;

interface Tooth {
  toothType: ToothType;
  toothNumber: ToothNumber;
  baseNumber: number;
  findings: string[];
  preliminaryFindings: string[];
}

type ToothType = "primary" | "secondary";
type ToothNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

function initialUpperJawRight(): JawQuadrant {
  return {
    quadrantNumber: 1,
    teeth: [
      defineTooth(18),
      defineTooth(17),
      defineTooth(16),
      defineTooth(15),
      defineTooth(14, ["F", "V"]),
      defineTooth(13, ["F"]),
      defineTooth(12, ["F"]),
      defineTooth(11),
    ],
  };
}

function initialUpperJawLeft(): JawQuadrant {
  return {
    quadrantNumber: 2,
    teeth: [
      defineTooth(21),
      defineTooth(62),
      defineTooth(63),
      defineTooth(24),
      defineTooth(25),
      defineTooth(26, ["U"]),
      defineTooth(27),
      defineTooth(28),
    ],
  };
}

function initialLowerJawRight(): JawQuadrant {
  return {
    quadrantNumber: 4,
    teeth: [
      defineTooth(48),
      defineTooth(47, ["U"]),
      defineTooth(46),
      defineTooth(45),
      defineTooth(44),
      defineTooth(43),
      defineTooth(42),
      defineTooth(41),
    ],
  };
}

function initialLowerJawLeft(): JawQuadrant {
  return {
    quadrantNumber: 3,
    teeth: [
      defineTooth(31),
      defineTooth(32),
      defineTooth(73),
      defineTooth(34),
      defineTooth(35),
      defineTooth(36),
      defineTooth(37, ["F", "V"]),
      defineTooth(38),
    ],
  };
}

type FindingRefs = FindingRef[][];
type FindingRef = RefObject<HTMLInputElement>;

function initialFindingRefs(): FindingRefs {
  const refs: FindingRefs = [];
  for (let i = 0; i < 8; i++) {
    refs.push([createRef(), createRef(), createRef()]);
  }
  return refs;
}

export default function DentalExaminationPrototypePage() {
  return (
    <StickyToolbarLayout toolbar={<ChildToolbar />}>
      <MainContentLayout fullViewportHeight>
        <Grid container spacing={4}>
          <Grid xs={4}>
            <Stack spacing={4}>
              <AdditionalInfosSheet />
              <ChildSheet />
            </Stack>
          </Grid>
          <Grid xs={8}>
            <Stack gap={4}>
              <ExaminationSheet />
              <CommentSheet />
            </Stack>
          </Grid>
        </Grid>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function ChildToolbar() {
  return (
    <TabNavigationToolbar
      header={
        <PersonToolbarHeader
          person={{
            firstName: "Maximilian",
            lastName: "Müller",
            dateOfBirth: new Date("2018-05-28"),
          }}
        />
      }
      routeBack={"/"}
      items={[
        {
          tabButtonName: "Kindsdaten",
          href: "#",
          decorator: <TextSnippetOutlined />,
          disabled: true,
        },
        {
          tabButtonName: "Untersuchung",
          href: "/playground/prototypes/dental-examination",
          decorator: <MedicalServicesOutlined />,
        },
        {
          tabButtonName: "Verlaufseinträge",
          href: "#",
          decorator: <TimelineOutlined />,
          disabled: true,
        },
      ]}
    />
  );
}

const ContentSheet = styled(Sheet)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
}));

function AdditionalInfosSheet() {
  return (
    <ContentSheet>
      <Stack direction="row" spacing={3} justifyContent="space-between">
        <ContentPanelTitle>Zusatzinfos</ContentPanelTitle>
        <Button startDecorator={<DocumentScanner />}>Elternbrief</Button>
      </Stack>
      <Stack spacing={3} divider={<Divider />}>
        <Grid container spacing={3} columns={2}>
          <Grid xxs={1}>
            <PlaceholderField label="Schema" />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField label="Gebisstyp" />
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={2}>
          <Grid xxs={1}>
            <PlaceholderField label="Fluoridierung" />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField label="Plague" />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField label="Gingivitis" />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField label="Zahnstein" />
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={3} alignItems="flex-end">
          <Grid xxs={1}>
            <PlaceholderField label="KFO-Befunde" />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField label="Karieshochrisiko" />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField label="dmf-t" />
          </Grid>
          <Grid xxs={1}>
            <PlaceholderField label="DMF-T" />
          </Grid>
          <Grid xxs={1.5}>
            <PlaceholderField label="ECC" />
          </Grid>
          <Grid xxs={1.5}>
            <PlaceholderField label="NBS" />
          </Grid>
        </Grid>
      </Stack>
    </ContentSheet>
  );
}

function PlaceholderField(props: { label?: string }) {
  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <Input />
    </FormControl>
  );
}

function ChildSheet() {
  return (
    <ContentSheet>
      <Stack direction="row" gap={2} justifyContent="space-between">
        <ContentPanelTitle>Angaben zu Maximilian Müller</ContentPanelTitle>
        <KeyboardArrowUpOutlined />
      </Stack>
    </ContentSheet>
  );
}

function CommentSheet() {
  return (
    <ContentSheet>
      <ContentPanelTitle>Kommentar</ContentPanelTitle>
      <Textarea minRows={3} />
    </ContentSheet>
  );
}

function defineTooth(
  fullNumber: number,
  preliminaryFindings: string[] = [],
): Tooth {
  const isPrimary = fullNumber > 50;
  const toothNumber = (fullNumber % 10) as ToothNumber;
  const baseNumber =
    fullNumber - toothNumber - (isPrimary ? PRIMARY_TOOTH_OFFSET : 0);

  return {
    toothType: isPrimary ? "primary" : "secondary",
    toothNumber,
    baseNumber,
    findings: ["", "", ""],
    preliminaryFindings,
  };
}

function isUpperJaw(quadrantNumber: QuadrantNumber) {
  return quadrantNumber === 1 || quadrantNumber === 2;
}

function isRightQuadrant(quadrantNumber: QuadrantNumber) {
  return quadrantNumber === 1 || quadrantNumber === 4;
}

const TOOTH_ROOTS: Record<ToothNumber, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 2,
  5: 1,
  6: 2,
  7: 3,
  8: 3,
};

const ToothNumberBadge = styled("span")(({ theme }) => ({
  fontSize: theme.fontSize.sm,
  borderRadius: theme.radius.sm,
  backgroundColor: "rgb(217, 217, 217)",
  fontWeight: theme.fontWeight.lg,
  width: 32,
  textAlign: "center",
}));

function withToggledToothType(
  toothIndex: number,
  jawQuadrant: JawQuadrant,
): JawQuadrant {
  const { quadrantNumber, teeth } = jawQuadrant;
  const tooth = teeth[toothIndex]!;
  return {
    quadrantNumber,
    teeth: teeth.with(toothIndex, {
      ...tooth,
      toothType: tooth.toothType === "primary" ? "secondary" : "primary",
    }),
  };
}

function withUpdatedFinding(
  toothIndex: number,
  findingIndex: number,
  newValue: string,
  jawQuadrant: JawQuadrant,
): JawQuadrant {
  const { quadrantNumber, teeth } = jawQuadrant;
  const targetTooth = teeth[toothIndex]!;
  return {
    quadrantNumber,
    teeth: teeth.with(toothIndex, {
      ...targetTooth,
      findings: targetTooth.findings.with(findingIndex, newValue),
    }),
  };
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "--ButtonGroup-separatorColor": theme.palette.divider,
  alignSelf: "center",
}));

const StyledButton = styled(Button, {
  shouldForwardProp: (propName) => propName !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  width: 250,
  backgroundColor: active ? undefined : theme.palette.background.level1,
  color: active ? undefined : theme.palette.text.primary,
  fontWeight: active ? undefined : theme.fontWeight.md,
}));

function ToggleButton(props: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <StyledButton
      active={props.active}
      variant={props.active ? undefined : "soft"}
      onClick={props.onClick}
    >
      {props.children}
    </StyledButton>
  );
}

type ExaminationView = "UPPER_JAW" | "LOWER_JAW" | "OVERVIEW";

function ExaminationSheet() {
  const [view, setView] = useState<ExaminationView>("UPPER_JAW");
  const [upperRightJaw, setUpperRightJaw] =
    useState<JawQuadrant>(initialUpperJawRight);
  const [upperLeftJaw, setUpperLeftJaw] =
    useState<JawQuadrant>(initialUpperJawLeft);
  const [lowerRightJaw, setLowerRightJaw] =
    useState<JawQuadrant>(initialLowerJawRight);
  const [lowerLeftJaw, setLowerLeftJaw] =
    useState<JawQuadrant>(initialLowerJawLeft);
  const [rightQuadrantFindingRefs] = useState<FindingRefs>(initialFindingRefs);
  const [leftQuadrantFindingRefs] = useState<FindingRefs>(initialFindingRefs);
  const findingsLegendSidebar = useFindingsLegendSidebar();

  function onNavigate(
    quadrantPosition: "left" | "right",
    toothIndex: number,
    findingIndex: number,
    direction: NavigationDirection,
  ) {
    const currentQuadrantFindingRefs =
      quadrantPosition === "left"
        ? leftQuadrantFindingRefs
        : rightQuadrantFindingRefs;

    if (direction === "LEFT") {
      if (toothIndex > 0) {
        focusFindingInput(toothIndex - 1, 0, currentQuadrantFindingRefs);
      } else if (quadrantPosition === "left") {
        focusFindingInput(
          rightQuadrantFindingRefs.length - 1,
          0,
          rightQuadrantFindingRefs,
        );
      } else if (quadrantPosition === "right" && view === "LOWER_JAW") {
        onNavigateWithViewChange("UPPER_JAW", "left", 7);
      }
    } else if (direction === "RIGHT") {
      if (toothIndex < currentQuadrantFindingRefs.length - 1) {
        focusFindingInput(toothIndex + 1, 0, currentQuadrantFindingRefs);
      } else if (quadrantPosition === "right") {
        focusFindingInput(0, 0, leftQuadrantFindingRefs);
      } else if (quadrantPosition === "left" && view === "UPPER_JAW") {
        onNavigateWithViewChange("LOWER_JAW", "right", 0);
      } else if (quadrantPosition === "left" && view === "LOWER_JAW") {
        setView("OVERVIEW");
      }
    } else if (direction === "UP") {
      if (findingIndex > 0) {
        focusFindingInput(
          toothIndex,
          findingIndex - 1,
          currentQuadrantFindingRefs,
        );
      }
    } else if (direction === "DOWN") {
      if (findingIndex < currentQuadrantFindingRefs[toothIndex]!.length - 1) {
        focusFindingInput(
          toothIndex,
          findingIndex + 1,
          currentQuadrantFindingRefs,
        );
      }
    }
  }

  function onNavigateWithViewChange(
    view: ExaminationView,
    quadrantPosition: "right" | "left",
    toothIndex: number,
  ) {
    setView(view);
    setTimeout(() => {
      focusFindingInput(
        toothIndex,
        0,
        quadrantPosition === "right"
          ? rightQuadrantFindingRefs
          : leftQuadrantFindingRefs,
      );
    }, 250);
  }

  return (
    <ContentSheet>
      <Stack spacing={3} width="fit-content">
        <StyledToggleButtonGroup color="primary" variant="solid">
          <ToggleButton
            active={view === "UPPER_JAW"}
            onClick={() => setView("UPPER_JAW")}
          >
            Oberkiefer
          </ToggleButton>
          <ToggleButton
            active={view === "LOWER_JAW"}
            onClick={() => setView("LOWER_JAW")}
          >
            Unterkiefer
          </ToggleButton>
          <ToggleButton
            active={view === "OVERVIEW"}
            onClick={() => setView("OVERVIEW")}
          >
            Gesamtgebiss
          </ToggleButton>
        </StyledToggleButtonGroup>
        {view === "UPPER_JAW" ? (
          <EditableJawView
            rightQuadrant={upperRightJaw}
            leftQuadrant={upperLeftJaw}
            rightQuadrantFindingRefs={rightQuadrantFindingRefs}
            leftQuadrantFindingRefs={leftQuadrantFindingRefs}
            onChangeRightQuadrant={setUpperRightJaw}
            onChangeLeftQuadrant={setUpperLeftJaw}
            onNavigate={onNavigate}
          />
        ) : view === "LOWER_JAW" ? (
          <EditableJawView
            rightQuadrant={lowerRightJaw}
            leftQuadrant={lowerLeftJaw}
            rightQuadrantFindingRefs={rightQuadrantFindingRefs}
            leftQuadrantFindingRefs={leftQuadrantFindingRefs}
            onChangeRightQuadrant={setLowerRightJaw}
            onChangeLeftQuadrant={setLowerLeftJaw}
            onNavigate={onNavigate}
          />
        ) : (
          <JawOverview
            upperRightJaw={upperRightJaw}
            upperLeftJaw={upperLeftJaw}
            lowerRightJaw={lowerRightJaw}
            lowerLeftJaw={lowerLeftJaw}
            onClickTooth={(
              quadrantNumber: QuadrantNumber,
              toothIndex: number,
            ) => {
              onNavigateWithViewChange(
                isUpperJaw(quadrantNumber) ? "UPPER_JAW" : "LOWER_JAW",
                isRightQuadrant(quadrantNumber) ? "right" : "left",
                toothIndex,
              );
            }}
          />
        )}
        <Stack
          direction="row"
          spacing={3}
          justifyContent="space-between"
          marginBlockStart={4.5}
        >
          <Legend />
          <ButtonLink underline="always" onClick={findingsLegendSidebar.open}>
            Befundwerte?
          </ButtonLink>
        </Stack>
      </Stack>
    </ContentSheet>
  );
}

const StyledDivider = styled(Divider)({
  backgroundColor: "black",
  alignSelf: "center",
});

function EditableJawView(props: {
  rightQuadrant: JawQuadrant;
  leftQuadrant: JawQuadrant;
  rightQuadrantFindingRefs: FindingRefs;
  leftQuadrantFindingRefs: FindingRefs;
  onChangeRightQuadrant: (
    updateFn: (teeth: JawQuadrant) => JawQuadrant,
  ) => void;
  onChangeLeftQuadrant: (updateFn: (teeth: JawQuadrant) => JawQuadrant) => void;
  onNavigate: (
    quadrantPosition: "left" | "right",
    toothIndex: number,
    findingIndex: number,
    direction: NavigationDirection,
  ) => void;
}) {
  return (
    <Stack direction="row" spacing={3} flexWrap="wrap">
      <JawQuadrant
        value={props.rightQuadrant}
        renderFindings={(tooth, toothIndex) => (
          <EditableFindings
            findings={tooth.findings}
            preliminaryFindings={tooth.preliminaryFindings}
            findingRefs={props.rightQuadrantFindingRefs[toothIndex]!}
            onChangeFinding={(findingIndex, newValue) =>
              props.onChangeRightQuadrant((prevValue) =>
                withUpdatedFinding(
                  toothIndex,
                  findingIndex,
                  newValue,
                  prevValue,
                ),
              )
            }
            onNavigate={(findingIndex, direction) =>
              props.onNavigate("right", toothIndex, findingIndex, direction)
            }
          />
        )}
        onClickTooth={(toothIndex) =>
          props.onChangeRightQuadrant((prevValue) =>
            withToggledToothType(toothIndex, prevValue),
          )
        }
      />
      <StyledDivider
        orientation="vertical"
        sx={{
          height: 215,
        }}
      />
      <JawQuadrant
        value={props.leftQuadrant}
        renderFindings={(tooth, toothIndex) => (
          <EditableFindings
            findings={tooth.findings}
            preliminaryFindings={tooth.preliminaryFindings}
            findingRefs={props.leftQuadrantFindingRefs[toothIndex]!}
            onChangeFinding={(findingIndex, newValue) =>
              props.onChangeLeftQuadrant((prevValue) =>
                withUpdatedFinding(
                  toothIndex,
                  findingIndex,
                  newValue,
                  prevValue,
                ),
              )
            }
            onNavigate={(findingIndex, direction) =>
              props.onNavigate("left", toothIndex, findingIndex, direction)
            }
          />
        )}
        onClickTooth={(toothIndex) =>
          props.onChangeLeftQuadrant((prevValue) =>
            withToggledToothType(toothIndex, prevValue),
          )
        }
      />
    </Stack>
  );
}

function JawOverview(props: {
  upperRightJaw: JawQuadrant;
  upperLeftJaw: JawQuadrant;
  lowerRightJaw: JawQuadrant;
  lowerLeftJaw: JawQuadrant;
  onClickTooth: (quadrant: QuadrantNumber, toothIndex: number) => void;
}) {
  const toothSpacing = 3;
  return (
    <Stack direction="column" spacing={3}>
      <Stack direction="row" spacing={3}>
        <JawQuadrant
          value={props.upperRightJaw}
          toothSpacing={toothSpacing}
          renderFindings={(tooth, toothIndex) => (
            <ReadonlyFindings
              findings={tooth.findings}
              onClick={() =>
                props.onClickTooth(
                  props.upperRightJaw.quadrantNumber,
                  toothIndex,
                )
              }
            />
          )}
          onClickTooth={(toothIndex) =>
            props.onClickTooth(props.upperRightJaw.quadrantNumber, toothIndex)
          }
        />
        <StyledDivider
          orientation="vertical"
          sx={{ alignSelf: "flex-end", height: "150px", marginBottom: "-32px" }}
        />
        <JawQuadrant
          value={props.upperLeftJaw}
          toothSpacing={toothSpacing}
          renderFindings={(tooth, toothIndex) => (
            <ReadonlyFindings
              findings={tooth.findings}
              onClick={() =>
                props.onClickTooth(
                  props.upperLeftJaw.quadrantNumber,
                  toothIndex,
                )
              }
            />
          )}
          onClickTooth={(toothIndex) =>
            props.onClickTooth(props.upperLeftJaw.quadrantNumber, toothIndex)
          }
        />
      </Stack>
      <StyledDivider sx={{ width: "calc(100% - 32px)" }} />
      <Stack direction="row" spacing={3}>
        <JawQuadrant
          value={props.lowerRightJaw}
          toothSpacing={toothSpacing}
          mirrored
          renderFindings={(tooth, toothIndex) => (
            <ReadonlyFindings
              findings={tooth.findings}
              onClick={() =>
                props.onClickTooth(
                  props.lowerRightJaw.quadrantNumber,
                  toothIndex,
                )
              }
            />
          )}
          onClickTooth={(toothIndex) =>
            props.onClickTooth(props.lowerRightJaw.quadrantNumber, toothIndex)
          }
        />
        <StyledDivider
          orientation="vertical"
          sx={{ alignSelf: "flex-start", height: "150px", marginTop: "-32px" }}
        />
        <JawQuadrant
          value={props.lowerLeftJaw}
          toothSpacing={toothSpacing}
          mirrored
          renderFindings={(tooth, toothIndex) => (
            <ReadonlyFindings
              findings={tooth.findings}
              onClick={() =>
                props.onClickTooth(
                  props.lowerLeftJaw.quadrantNumber,
                  toothIndex,
                )
              }
            />
          )}
          onClickTooth={(toothIndex) =>
            props.onClickTooth(props.lowerLeftJaw.quadrantNumber, toothIndex)
          }
        />
      </Stack>
    </Stack>
  );
}

function JawQuadrant(props: {
  value: JawQuadrant;
  toothSpacing?: number;
  mirrored?: boolean;
  renderFindings: (tooth: Tooth, toothIndex: number) => ReactNode;
  onClickTooth: (toothIndex: number) => void;
}) {
  const { quadrantNumber, teeth } = props.value;
  const jawName = isUpperJaw(quadrantNumber) ? "Oberkiefer" : "Unterkiefer";
  const quadrantPosition = isRightQuadrant(quadrantNumber) ? "rechts" : "links";
  return (
    <Stack spacing={3} direction={props.mirrored ? "column-reverse" : "column"}>
      <Typography
        alignSelf={isRightQuadrant(quadrantNumber) ? "flex-start" : "flex-end"}
      >
        <Typography fontWeight="bold">
          {jawName} {quadrantPosition}
        </Typography>{" "}
        - Quadrant {quadrantNumber}
      </Typography>
      <Stack direction="row" spacing={props.toothSpacing ?? 1}>
        {teeth.map((tooth, toothIndex) => (
          <Stack
            key={toothIndex}
            direction={props.mirrored ? "column-reverse" : "column"}
            alignItems="center"
            spacing={2}
          >
            <ToothNumberBadge>{getFullToothNumber(tooth)}</ToothNumberBadge>
            <ToothButton
              quadrantNumber={quadrantNumber}
              value={tooth}
              onClick={() => props.onClickTooth(toothIndex)}
            />
            {props.renderFindings(tooth, toothIndex)}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function getFullToothNumber(tooth: Tooth): number {
  return (
    tooth.baseNumber +
    tooth.toothNumber +
    (tooth.toothType === "primary" ? PRIMARY_TOOTH_OFFSET : 0)
  );
}

function EditableFindings(props: {
  findings: string[];
  preliminaryFindings: string[];
  findingRefs: FindingRef[];
  onChangeFinding: (findingIndex: number, newValue: string) => void;
  onNavigate: (findingIndex: number, direction: NavigationDirection) => void;
}) {
  return (
    <>
      {props.findings.map((finding, findingIndex) => (
        <FindingInput
          key={findingIndex}
          value={finding}
          inputRef={props.findingRefs[findingIndex]!}
          onChange={(newValue) => props.onChangeFinding(findingIndex, newValue)}
          onNavigate={(direction) => props.onNavigate(findingIndex, direction)}
        />
      ))}
      {props.preliminaryFindings.length > 0 && (
        <Typography color="danger">
          {props.preliminaryFindings.join(", ")}
        </Typography>
      )}
    </>
  );
}

function ReadonlyFindings(props: { findings: string[]; onClick: () => void }) {
  const availableFindings = props.findings.filter((finding) => finding !== "");

  return (
    <Typography
      fontSize="sm"
      height={16}
      onClick={props.onClick}
      sx={{ cursor: "pointer" }}
    >
      {availableFindings.length > 0 ? availableFindings.join(", ") : "-"}
    </Typography>
  );
}

interface ToothProps {
  toothType: ToothType;
  toothNumber: ToothNumber;
}

function excludeToothProps(propName: string): boolean {
  return propName !== "toothType" && propName !== "toothNumber";
}

const TOOTH_COLOR: Record<ToothType, string> = {
  primary: "rgba(99, 107, 116, 0.3)",
  secondary: "rgba(23, 26, 28, 1)",
};

const OuterToothButton = styled(Button, {
  shouldForwardProp: excludeToothProps,
})<ToothProps>(({ theme, toothType, toothNumber }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: TOOTH_COLOR[toothType],
  borderRadius: theme.radius.md,
  width: toothNumber <= 3 ? 40 : toothNumber <= 5 ? 48 : 56,
  height: toothNumber === 2 ? 40 : 48,
  paddingBlock: toothNumber === 2 ? 6 : 8,
  paddingInline: toothNumber <= 3 ? 6 : toothNumber <= 5 ? 8 : 9,
}));

const InnerTooth = styled("div", {
  shouldForwardProp: excludeToothProps,
})<Pick<ToothProps, "toothType">>(({ theme, toothType }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: TOOTH_COLOR[toothType],
  borderRadius: theme.radius.sm,
  width: "100%",
  height: "100%",
}));

function ToothButton(props: {
  quadrantNumber: QuadrantNumber;
  value: Tooth;
  onClick: () => void;
}) {
  const { toothType, toothNumber, preliminaryFindings } = props.value;

  return (
    <Stack
      direction={isUpperJaw(props.quadrantNumber) ? "column" : "column-reverse"}
      spacing={0.5}
      height={66}
      justifyContent="flex-end"
    >
      <DentalRoots
        quadrantNumber={props.quadrantNumber}
        toothType={toothType}
        rootCount={TOOTH_ROOTS[toothNumber]}
      />
      <OuterToothButton
        toothType={toothType}
        toothNumber={toothNumber}
        type="button"
        color="neutral"
        variant="plain"
        onClick={props.onClick}
      >
        <InnerTooth toothType={toothType}>
          {preliminaryFindings.length > 0 ? <ErrorMarker /> : null}
        </InnerTooth>
      </OuterToothButton>
    </Stack>
  );
}

function focusFindingInput(
  toothIndex: number,
  findingIndex: number,
  findingRefs: FindingRef[][],
) {
  const refsByTooth = findingRefs[toothIndex];

  if (refsByTooth === undefined) {
    throw new Error("Invalid tooth index");
  }

  const findingRef = refsByTooth[findingIndex];
  const findingInput = findingRef?.current;

  if (isNullish(findingInput)) {
    throw new Error("Invalid finding index");
  }

  findingInput.focus();
}

type NavigationDirection = "LEFT" | "RIGHT" | "UP" | "DOWN";

const DIRECTIONS: Record<string, NavigationDirection> = {
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  ArrowUp: "UP",
  ArrowDown: "DOWN",
};

const FINDINGS: Record<string, string> = {
  S: "Kariesfrei",
  I: "Initialkaries",
  D: "Kariös",
  F: "gefüllt",
  E: "Extrahiert",
  Y: "KFO-Extr.",
  X: "Nichtanlage",
  Z: "Zerstört",
  T: "Trauma",
  H: "Hypoplasie",
  O: "Trep/Fistel",
  V: "versiegelt",
  N: "Nicht beurteilbar",
  P: "Platzhalter",
  DA: "Doppelte Anlage",
  FA: "Formanomalie",
  FIS: "Fistel",
  ID: "Im Durchbruch",
  INS: "insuffizie",
  K: "Krone",
  LÜ: "Lückenschluss",
  RET: "retinierter Zahn",
  TR: "trepaniert",
  WR: "Wurzelrest",
  ZA: "Zapfenzahn",
  M: "Milchzahn",
  B: "bleibender Zahn",
  W: "Wechselgebiss",
};

function FindingInput(props: {
  value: string;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (newValue: string) => void;
  onNavigate: (direction: NavigationDirection) => void;
}) {
  const { inputRef, value } = props;
  return (
    <Input
      slotProps={{ input: { ref: inputRef } }}
      value={value}
      color={value === "" || value in FINDINGS ? "primary" : "danger"}
      sx={{ width: 59 }}
      onChange={(event) =>
        props.onChange(event.target.value.trim().toUpperCase())
      }
      onKeyUp={(event) => {
        const keyCode = event.code;
        const targetDirection = DIRECTIONS[keyCode];
        if (isDefined(targetDirection)) {
          props.onNavigate(targetDirection);
          event.preventDefault();
        }
      }}
    />
  );
}

function Legend() {
  return (
    <Stack direction="row" gap={3}>
      <Typography>
        <ErrorMarker /> = Vorbefund vorhanden
      </Typography>
      <Typography>
        <Marker color="text.primary" /> = Bleibender Zahn
      </Typography>
      <Typography>
        <Marker color="divider" /> = Milchzahn
      </Typography>
    </Stack>
  );
}

function Marker(props: { color: string; children?: ReactNode }) {
  return (
    <Box
      component="span"
      display="inline-block"
      color="white"
      bgcolor={props.color}
      borderRadius="50%"
      textAlign="center"
      fontSize="xs"
      width={18}
      height={18}
      sx={{ verticalAlign: "middle" }}
    >
      {props.children}
    </Box>
  );
}

function ErrorMarker() {
  return <Marker color="danger.solidBg">!</Marker>;
}

function RootIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg width="13" height="12" viewBox="0 0 13 12" stroke="currentColor">
        <path
          d="M7.39443 2.02492L11.1584 9.55278C11.4908 10.2177 11.0073 11 10.2639 11H2.73607C1.99269 11 1.50919 10.2177 1.84164 9.55279L5.60557 2.02492C5.9741 1.28787 7.0259 1.28787 7.39443 2.02492Z"
          fill="transparent"
          stroke-width="2"
        />
      </svg>
    </SvgIcon>
  );
}

interface DentalRootIconProps {
  quadrantNumber: QuadrantNumber;
  toothType: ToothType;
}

function excludRootIconProps(propName: string): boolean {
  return propName !== "quadrantNumber" && propName !== "toothType";
}

const DentalRootIcon = styled(RootIcon, {
  shouldForwardProp: excludRootIconProps,
})<DentalRootIconProps>(({ quadrantNumber, toothType }) => ({
  width: 14,
  height: 14,
  color: TOOTH_COLOR[toothType],
  transform: isUpperJaw(quadrantNumber) ? undefined : "rotate(180deg)",
}));

function DentalRoots(
  props: {
    rootCount: number;
  } & DentalRootIconProps,
) {
  const { rootCount, toothType } = props;

  if (rootCount === 0) {
    return null;
  }

  return (
    <Stack direction="row" gap="2px" justifyContent="center">
      {Array.from({ length: rootCount }, (_, index) => index).map(
        (_, index) => (
          <DentalRootIcon
            key={index}
            quadrantNumber={props.quadrantNumber}
            toothType={toothType}
          />
        ),
      )}
    </Stack>
  );
}

function useFindingsLegendSidebar() {
  return useSidebar({
    component: FindingsLegendSidebar,
  });
}

function FindingsLegendSidebar(props: DrawerProps) {
  return (
    <>
      <SidebarContent title="Mögliche Befundwerte">
        <table>
          {Object.entries(FINDINGS).map(([abbreviation, description]) => (
            <tr key={abbreviation}>
              <th style={{ textAlign: "left" }}>{abbreviation}</th>
              <td>= {description}</td>
            </tr>
          ))}
        </table>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <Button
              color="neutral"
              variant="soft"
              onClick={() => props.onClose()}
            >
              Schließen
            </Button>
          }
        />
      </SidebarActions>
    </>
  );
}
