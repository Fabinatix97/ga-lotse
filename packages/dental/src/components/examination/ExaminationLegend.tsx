/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { Circle, CircleOutlined, Error } from "@mui/icons-material";
import { Button, List, ListItem, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

export function ExaminationLegend() {
  const findingsOverviewSidebar = useSidebar({
    component: FindingsOverviewSidebar,
  });
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <List orientation="horizontal" size="sm" aria-label="Legende">
        <ListItem>
          <LegendItem
            icon={
              <Error
                color="danger"
                aria-label="Ausrufezeichen"
                aria-hidden={false}
              />
            }
            helpText="Vorbefund vorhanden"
          />
        </ListItem>
        <ListItem>
          <LegendItem
            icon={
              <Circle
                color="neutral"
                aria-label="Ausgefüllt"
                aria-hidden={false}
              />
            }
            helpText="Bleibender Zahn"
          />
        </ListItem>
        <ListItem>
          <LegendItem
            icon={
              <CircleOutlined
                color="neutral"
                aria-label="Nicht ausgefüllt"
                aria-hidden={false}
              />
            }
            helpText="Milchzahn"
          />
        </ListItem>
      </List>
      <ButtonLink onClick={findingsOverviewSidebar.open}>
        Befundwerte?
      </ButtonLink>
    </Stack>
  );
}

interface LegendItemProps {
  icon: ReactNode;
  helpText: string;
}

function LegendItem({ icon, helpText }: LegendItemProps) {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {icon}
      <Typography component="span">= {helpText}</Typography>
    </Stack>
  );
}

function FindingsOverviewSidebar({ onClose }: DrawerProps) {
  return (
    <>
      <SidebarContent title="Mögliche Befundwerte">
        <List size="sm" aria-label="Abkürzungsverzeichnis">
          {Object.entries(POSSIBLE_DIAGNOSES).map(([abbr, expl]) => (
            <ListItem key={abbr}>
              <Diagnosis
                key={abbr}
                abbreviation={abbr as Abbreviation}
                explanation={expl}
              />
            </ListItem>
          ))}
        </List>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              color="neutral"
              variant="soft"
              key="close"
              onClick={() => onClose()}
            >
              Schließen
            </Button>,
          ]}
        />
      </SidebarActions>
    </>
  );
}

type Abbreviation = keyof typeof POSSIBLE_DIAGNOSES;
type Explanation = (typeof POSSIBLE_DIAGNOSES)[keyof typeof POSSIBLE_DIAGNOSES];

const POSSIBLE_DIAGNOSES = {
  S: "Kariesfrei",
  I: "Initialkaries",
  D: "Kariös",
  F: "Gefüllt",
  E: "Extrahiert",
  Y: "KFO-Extr.",
  X: "Nichtanlage",
  Z: "Zerstört",
  T: "Trauma",
  H: "Hypoplasie",
  O: "Trep/Fistel",
  V: "Versiegelt",
  N: "Nicht beurteilbar",
  P: "Platzhalter",
  U: "BZ nicht da",
  DA: "Doppelte Anlage",
  FA: "Formanomalie",
  FIS: "Fistel",
  ID: "Im Durchbruch",
  INS: "Insuffizient",
  K: "Krone",
  LÜ: "Lückenschluss",
  RET: "Retinierter Zahn",
  TR: "Trepaniert",
  WR: "Wurzelrest",
  ZA: "Zapfenzahn",
};

interface DiagnosisProp {
  abbreviation: Abbreviation;
  explanation: Explanation;
}

function Diagnosis({ abbreviation, explanation }: DiagnosisProp) {
  return (
    <Stack direction="row" gap={1}>
      <Typography
        component="span"
        level="title-md"
        sx={{ fontWeight: 600, width: 24 }}
      >
        {abbreviation}
      </Typography>
      <Typography component="span" level="body-md">
        = {explanation}
      </Typography>
    </Stack>
  );
}
