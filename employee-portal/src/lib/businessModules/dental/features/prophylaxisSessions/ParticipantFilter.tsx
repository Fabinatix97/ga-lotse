/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Radio, RadioGroup, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useId } from "react";

import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";
import { ParticipantFilters } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/participantFilters";

export interface ParticipantFilterDef<TValue extends string> {
  label: string;
  value: TValue;
}

interface ParticipantFilterProps<TValue extends string> {
  name: keyof ParticipantFilters;
  label: string;
  filters: ParticipantFilterDef<TValue>[];
  sx?: SxProps;
}

export function ParticipantFilter<TValue extends string>(
  props: ParticipantFilterProps<TValue>,
) {
  const participantFilters = useProphylaxisSessionStore(
    (state) => state.participantFilters,
  );
  const setParticipantFilters = useProphylaxisSessionStore(
    (state) => state.setParticipantFilters,
  );
  const labelId = useId();

  return (
    <Stack
      direction="row"
      gap={3}
      sx={{ flexWrap: "wrap", alignItems: "center", ...props.sx }}
    >
      <Typography level="title-md" id={labelId}>
        {props.label}:
      </Typography>
      <RadioGroup
        orientation="horizontal"
        value={participantFilters[props.name]}
        aria-labelledby={labelId}
      >
        {props.filters.map((filter) => (
          <Radio
            key={filter.value}
            value={filter.value}
            label={filter.label}
            onChange={() =>
              setParticipantFilters({ [props.name]: filter.value })
            }
          />
        ))}
      </RadioGroup>
    </Stack>
  );
}
