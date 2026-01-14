/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { mapToSelectOption } from "@eshg/lib-employee-portal";
import {
  QueryKeyFactory,
  SingleAutocompleteField,
  useValidateLength,
} from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../api/AppointmentBlockApi";
import { useGetAppointmentBlockRooms } from "../../api/queries/appointmentBlock";

interface SearchRoomFieldProps {
  appointmentBlockApi: AppointmentBlockApi;
  queryKey: QueryKeyFactory;
}

export function AppointmentRoomField(props: SearchRoomFieldProps) {
  const validateLength = useValidateLength();

  const searchRooms = useGetAppointmentBlockRooms(
    props.appointmentBlockApi,
    props.queryKey,
  );
  const rooms = searchRooms.isSuccess ? searchRooms.data : [];
  const options = rooms.map(mapToSelectOption);

  return (
    <SingleAutocompleteField
      name="room"
      label="Raum"
      options={options}
      placeholder="Raum suchen"
      validate={validateLength(1, 60)}
      loading={searchRooms.isLoading}
      fetching={searchRooms.isFetching}
      freeSolo
    />
  );
}
