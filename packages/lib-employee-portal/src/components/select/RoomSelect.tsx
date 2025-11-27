/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryKeyFactory, SelectOptions } from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../api/AppointmentBlockApi";
import { useGetAppointmentBlockRooms } from "../../api/queries/appointmentBlock";
import { SetDictionaryFilterFn } from "../../features/filters/hooks/useFilterDictionary";
import { mapToSelectOption } from "../../utils/mappers";

import { ResettableSingleSelect } from "./ResettableSingleSelect";

interface RoomFilter {
  roomFilter?: string;
}

export function RoomSelect(props: {
  appointmentBlockApi: AppointmentBlockApi;
  queryKey: QueryKeyFactory;
  filterFormValues: RoomFilter;
  setFilterFormValue: SetDictionaryFilterFn<keyof RoomFilter, RoomFilter>;
}) {
  const searchRooms = useGetAppointmentBlockRooms(
    props.appointmentBlockApi,
    props.queryKey,
  );
  const rooms = searchRooms.isSuccess ? searchRooms.data : [];
  const options = rooms.map(mapToSelectOption);

  return (
    <ResettableSingleSelect
      value={props.filterFormValues.roomFilter ?? ""}
      onChange={(_, newValue) => {
        if (newValue === null) {
          return;
        }
        props.setFilterFormValue("roomFilter", newValue);
      }}
      onResetSelect={() => {
        props.setFilterFormValue("roomFilter", undefined);
      }}
    >
      <SelectOptions options={options} />
    </ResettableSingleSelect>
  );
}
