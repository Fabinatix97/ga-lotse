/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Select, SelectProps, Stack } from "@mui/joy";
import { ReactNode, useCallback, useMemo } from "react";
import { isEmpty, isNonNullish, unique } from "remeda";

import { CustomAutocomplete } from "@eshg/lib-portal";
import {
  ApiAdminActorSelector,
  ApiAdminActorType,
  ApiAdminOrgUnitType,
  ApiFederalState,
} from "@eshg/service-directory-api";

import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { SelectOptions } from "@/lib/components/table/SelectOptions";
import { ActorsChip } from "@/lib/components/table/cell/common/ActorsChip";
import {
  filterActorBySelector,
  filterOrgUnit,
  formatActorSelector,
} from "@/lib/helpers/actorSelector";
import { isRule } from "@/lib/helpers/entityValidation";
import { useCommitDryRun } from "@/lib/hooks/useCommitDryRun";
import { Actor, RuleData, useEntities } from "@/lib/hooks/useEntities";
import { useUpdateEntity } from "@/lib/hooks/useUpdateEntity";

export function ActorSelectorCell(
  props: Readonly<CommonCellProps<RuleData>>,
): ReactNode {
  if (props.editable) {
    return <EditableActorSelectorCell {...props} />;
  }
  return <StaticActorSelectorCell {...props} />;
}

function EditableActorSelectorCell(
  props: Readonly<CommonCellProps<RuleData>>,
): ReactNode {
  const { allOrgUnits, allActors } = useEntities();
  const updateEntity = useUpdateEntity();

  const { value, columnId } = getValues(props.id, props.entity.entity);

  const handleChange = useCallback(
    (key: keyof ApiAdminActorSelector) => (value: string | undefined) => {
      updateEntity(props.entity, {
        [columnId]: {
          ...props.entity.entity?.[columnId],
          [key]: value,
        },
      });
    },
    [columnId, props.entity, updateEntity],
  );

  const orgUnitNames = useMemo(
    () =>
      unique(
        allOrgUnits
          .filter(filterOrgUnit({ ...value, orgUnitName: undefined }))
          .map(({ entity }) => entity?.readableName)
          .filter(isNonNullish)
          .sort((a, b) => a.localeCompare(b)),
      ),
    [allOrgUnits, value],
  );

  const actorNames = useMemo(
    () =>
      unique(
        allActors
          .filter((actor) =>
            filterActorBySelector(
              {
                ...value,
                actorName: undefined,
              },
              actor,
            ),
          )
          .map(({ entity }) => entity?.readableName)
          .filter(isNonNullish)
          .sort((a, b) => a.localeCompare(b)),
      ),
    [allActors, value],
  );

  //sx={{width: 380, flexWrap: "wrap"}}>
  return (
    <Stack alignItems="baseline" flexWrap="wrap">
      <SingleSelect
        label="federalState"
        value={value.federalState}
        options={Object.values(ApiFederalState)}
        rowId={props.entity.id}
        selector={columnId}
        onChange={handleChange("federalState")}
      />
      <Divider />
      <SingleSelect
        label="orgUnitType"
        value={value.orgUnitType}
        options={Object.values(ApiAdminOrgUnitType)}
        rowId={props.entity.id}
        selector={columnId}
        onChange={handleChange("orgUnitType")}
      />
      <Divider />
      <TextInput
        label="orgUnitName"
        options={orgUnitNames}
        value={value.orgUnitName}
        rowId={props.entity.id}
        selector={columnId}
        onChange={handleChange("orgUnitName")}
      />
      <Divider />
      {/* We do this, so everything is in one line if there is enough space */}
      <Stack flexWrap="nowrap">
        <SingleSelect
          label="actorType"
          value={value.actorType}
          options={Object.values(ApiAdminActorType)}
          rowId={props.entity.id}
          selector={columnId}
          onChange={handleChange("actorType")}
        />
        <Divider />
        <TextInput
          label="actorName"
          options={actorNames}
          value={value.actorName}
          rowId={props.entity.id}
          selector={columnId}
          onChange={handleChange("actorName")}
        />
      </Stack>
    </Stack>
  );
}

function Divider() {
  return "/";
}

function SingleSelect(
  props: Readonly<{
    label: string;
    options: string[];
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    rowId: string;
    selector: "client" | "server";
  }>,
) {
  const errorMessage = useCommitDryRun();
  const serverError =
    !!errorMessage?.ids.includes(props.rowId) &&
    !!errorMessage?.columns?.includes(
      `${props.selector}${capitalize(props.label)}`,
    );
  const color = serverError ? "danger" : undefined;

  const value = props.value ?? "*";
  const selectProps: SelectProps<string, false> = {
    value,
    multiple: false,
    onChange(_event, value: string | null) {
      if (!value || value === "*") {
        props.onChange(undefined);
      } else {
        props.onChange(value);
      }
    },
  };

  const options = [
    ...props.options.map((o) => ({ label: o, value: o })),
    {
      label: "*",
      value: "*",
    },
  ];

  return (
    <Select
      color={color}
      size="sm"
      placeholder={props.label}
      aria-label={props.label}
      {...selectProps}
      sx={{ flex: "0 1 75px" }}
    >
      <SelectOptions options={options} />
    </Select>
  );
}

function getColor(value: string | undefined, options: string[]) {
  return value && !options.includes(value) ? "warning" : undefined;
}

function TextInput(
  props: Readonly<{
    label: string;
    options: string[];
    value: string | undefined;
    onChange: (v: string | undefined) => void;
    rowId: string;
    selector: "client" | "server";
  }>,
) {
  const errorMessage = useCommitDryRun();
  const serverError =
    !!errorMessage?.ids.includes(props.rowId) &&
    !!errorMessage?.columns?.includes(
      `${props.selector}${capitalize(props.label)}`,
    );
  const color = serverError ? "danger" : getColor(props.value, props.options);

  return (
    <CustomAutocomplete
      freeSolo
      autoSelect
      value={props.value ?? ""}
      size="sm"
      placeholder="*"
      aria-label={props.label}
      options={props.options}
      sx={{ flex: "1 3 150px" }}
      slotProps={{
        listbox: {
          sx: { minWidth: "max-content" },
        },
      }}
      color={color}
      onChange={(_event, value) => {
        props.onChange(value ?? undefined);
      }}
    />
  );
}

function capitalize(str: string) {
  if (isEmpty(str)) {
    return str;
  }
  return str[0]!.toUpperCase() + str.slice(1);
}

function StaticActorSelectorCell(props: Readonly<CommonCellProps<RuleData>>) {
  if (!isRule(props.entity)) {
    throw new Error("StaticActorSelectorCell used with non-rule entity");
  }

  const { matchingActors, linkName, value } = getValues(
    props.id,
    props.entity.entity,
  );

  return (
    <Stack gap={1} justifyContent="space-between">
      {formatActorSelector(value ?? {})}
      <ActorsChip
        actors={matchingActors}
        columnId={props.id}
        rowId={props.entity.id}
        linkName={linkName}
      />
    </Stack>
  );
}

function getValues(
  id: keyof RuleData,
  entity?: RuleData,
): {
  matchingActors: Actor[];
  linkName: string;
  value: ApiAdminActorSelector;
  columnId: "client" | "server";
} {
  switch (id) {
    case "client":
      return {
        matchingActors: entity?._matchingClientActors ?? [],
        linkName: "_matchingClientRules",
        value: entity?.client ?? {},
        columnId: "client",
      };
    case "server":
      return {
        matchingActors: entity?._matchingServerActors ?? [],
        linkName: "_matchingServerRules",
        columnId: "server",
        value: entity?.server ?? {},
      };
    default:
      throw new Error("Unexpected column ID: " + id);
  }
}
