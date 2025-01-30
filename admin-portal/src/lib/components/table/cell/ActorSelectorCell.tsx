/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminActorSelector,
  ApiAdminActorType,
  ApiAdminOrgUnitType,
  ApiFederalState,
} from "@eshg/service-directory-api";
import { Autocomplete, Select, SelectProps, Stack } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ReactNode, useCallback, useMemo } from "react";
import { isEmpty, isNonNullish, unique } from "remeda";

import { SelectOptions } from "@/lib/components/table/SelectOptions";
import { StaticActorSelectorCell } from "@/lib/components/table/cell/StaticActorSelectorCell";
import {
  filterOrgUnit,
  useFilterActorBySelector,
} from "@/lib/helpers/actorSelector";
import { useEditableRow } from "@/lib/helpers/entityFilter";
import { useAuditedAndStagedActors } from "@/lib/hooks/useActors";
import { useCommitDryRun } from "@/lib/hooks/useCommitDryRun";
import { useOrgUnits } from "@/lib/hooks/useOrgUnits";
import { Rule } from "@/lib/hooks/useRules";

export function ActorSelectorCell(
  props: Readonly<CellContext<Rule, ApiAdminActorSelector>>,
): ReactNode {
  if (!useEditableRow(props.row)) {
    return <StaticActorSelectorCell {...props} />;
  }
  return <EditableActorSelectorCell {...props} />;
}

function EditableActorSelectorCell(
  props: Readonly<CellContext<Rule, ApiAdminActorSelector>>,
): ReactNode {
  const orgUnits = useOrgUnits();
  const actors = useAuditedAndStagedActors();

  // eslint-disable-next-line no-console
  console.assert(
    ["client", "server"].includes(props.column.id),
    "EditableActorSelectorCell used with unexpected column:",
    props.column.id,
  );
  const columnId = props.column.id as "client" | "server";

  const handleChange = useCallback(
    (key: keyof ApiAdminActorSelector) => (value: string | undefined) => {
      props.table.options.meta?.api?.update({
        id: props.row.original.id,
        [columnId]: {
          ...props.row.original[columnId],
          [key]: value,
        },
      });
    },
    [columnId, props.row.original, props.table.options.meta?.api],
  );

  const value = props.getValue();

  const orgUnitNames = useMemo(
    () =>
      unique(
        orgUnits
          .filter(filterOrgUnit({ ...value, orgUnitName: undefined }))
          .map(({ readableName }) => readableName)
          .filter(isNonNullish)
          .sort((a, b) => a.localeCompare(b)),
      ),
    [orgUnits, value],
  );

  const filterActorBySelector = useFilterActorBySelector();
  const actorNames = useMemo(
    () =>
      unique(
        actors
          .filter((actor) =>
            filterActorBySelector(
              {
                ...value,
                actorName: undefined,
              },
              actor,
            ),
          )
          .map(({ readableName }) => readableName)
          .filter(isNonNullish)
          .sort((a, b) => a.localeCompare(b)),
      ),
    [actors, filterActorBySelector, value],
  );

  //sx={{width: 380, flexWrap: "wrap"}}>
  return (
    <Stack alignItems="baseline" flexWrap="wrap">
      <SingleSelect
        label="federalState"
        value={value.federalState}
        onChange={handleChange("federalState")}
        options={Object.values(ApiFederalState)}
        rowId={props.row.original.id}
        selector={columnId}
      />
      <Divider />
      <SingleSelect
        label="orgUnitType"
        value={value.orgUnitType}
        onChange={handleChange("orgUnitType")}
        options={Object.values(ApiAdminOrgUnitType)}
        rowId={props.row.original.id}
        selector={columnId}
      />
      <Divider />
      <TextInput
        label="orgUnitName"
        options={orgUnitNames}
        value={value.orgUnitName}
        onChange={handleChange("orgUnitName")}
        rowId={props.row.original.id}
        selector={columnId}
      />
      <Divider />
      {/* We do this, so everything is in one line if there is enough space */}
      <Stack flexWrap="nowrap">
        <SingleSelect
          label="actorType"
          value={value.actorType}
          onChange={handleChange("actorType")}
          options={Object.values(ApiAdminActorType)}
          rowId={props.row.original.id}
          selector={columnId}
        />
        <Divider />
        <TextInput
          label="actorName"
          options={actorNames}
          value={value.actorName}
          onChange={handleChange("actorName")}
          rowId={props.row.original.id}
          selector={columnId}
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

  const value = props.value ? props.value : "*";
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
    <Autocomplete
      freeSolo
      autoSelect
      value={props.value ?? ""}
      onChange={(_event, value) => {
        props.onChange(value ?? undefined);
      }}
      size="sm"
      placeholder={"*"}
      aria-label={props.label}
      options={props.options}
      sx={{ flex: "1 3 150px" }}
      slotProps={{
        listbox: {
          sx: { minWidth: "max-content" },
        },
      }}
      color={color}
    />
  );
}

function capitalize(str: string) {
  if (isEmpty(str)) {
    return str;
  }
  return str[0]!.toUpperCase() + str.slice(1);
}
