/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Radio, RadioGroup, Typography } from "@mui/joy";
import { useId } from "react";

import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/store/ProphylaxisSessionStoreProvider";
import { ParticipantFilters } from "@/lib/businessModules/dental/features/prophylaxisSessions/store/participantFilters";

export interface ParticipantFilterDef<TValue extends string> {
  label: string;
  value: TValue;
}

interface ParticipantFilterProps<TValue extends string> {
  name: keyof ParticipantFilters;
  label: string;
  filters: ParticipantFilterDef<TValue>[];
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
    <>
      <Typography fontWeight={600} id={labelId}>
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
    </>
  );
}
