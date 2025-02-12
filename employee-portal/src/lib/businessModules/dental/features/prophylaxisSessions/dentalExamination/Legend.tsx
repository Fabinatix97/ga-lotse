/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import { Button, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function Legend() {
  const findingsOverviewSidebar = useSidebar({
    component: FindingsOverviewSidebar,
  });
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Stack direction="row" gap={3}>
        <LegendItem
          icon={<ErrorIcon color="danger" />}
          helpText="Vorbefund vorhanden"
        />
        <LegendItem
          icon={<CircleIcon color="neutral" />}
          helpText="Bleibender Zahn"
        />
        <LegendItem
          icon={<CircleOutlinedIcon color="neutral" />}
          helpText="Milchzahn"
        />
      </Stack>
      <Button variant="plain" onClick={findingsOverviewSidebar.open}>
        <Typography component="u" color="primary">
          Befundwerte?
        </Typography>
      </Button>
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
      <Typography>= {helpText}</Typography>
    </Stack>
  );
}

function FindingsOverviewSidebar({ onClose }: DrawerProps) {
  return (
    <>
      <SidebarContent title="Mögliche Befundwerte">
        <Stack>
          {Object.entries(POSSIBLE_DIAGNOSES).map(([abbr, expl]) => (
            <Diagnosis
              key={abbr}
              abbreviation={abbr as Abbreviation}
              explanation={expl}
            />
          ))}
        </Stack>
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
  da: "Doppelte Anlage",
  fa: "Formanomalie",
  fis: "Fistel",
  id: "Im Durchbruch",
  ins: "insuffizie",
  K: "Krone",
  lü: "Lückenschluss",
  ret: "retinierter Zahn",
  tr: "trepaniert",
  wr: "Wurzelrest",
  za: "Zapfenzahn",
};

interface DiagnosisProp {
  abbreviation: Abbreviation;
  explanation: Explanation;
}

function Diagnosis({ abbreviation, explanation }: DiagnosisProp) {
  return (
    <Stack direction="row" gap={2}>
      <Typography sx={{ fontWeight: 600, width: 24 }}>
        {abbreviation}
      </Typography>
      <Typography>= {explanation}</Typography>
    </Stack>
  );
}
