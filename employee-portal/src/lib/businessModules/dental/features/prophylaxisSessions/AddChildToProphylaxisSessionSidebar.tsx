/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ChildExamination,
  ChildSearchResult,
  useSearchChildren,
  useUpdateProphylaxisSessionParticipants,
} from "@eshg/dental";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import Cake from "@mui/icons-material/CakeOutlined";
import Groups from "@mui/icons-material/GroupsOutlined";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {
  Chip,
  CircularProgress,
  Stack,
  SvgIconTypeMap,
  Typography,
} from "@mui/joy";
import { OverridableComponent } from "@mui/types";
import { Formik } from "formik";
import { ReactNode } from "react";
import { useDebounce } from "use-debounce";

import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function useAddChildToProphylaxisSessionSidebar(): UseSidebarResult<AddChildToProphylaxisSessionSidebarProps> {
  return useSidebar({
    component: AddChildToProphylaxisSessionSidebar,
  });
}

interface AddChildToProphylaxisSessionSidebarFormFields {
  searchString: OptionalFieldValue<string>;
  selected: OptionalFieldValue<string>;
}

const RADIO_GROUP_FIELD_NAME = "selected";
const INITIAL_VALUES: AddChildToProphylaxisSessionSidebarFormFields = {
  searchString: "",
  selected: "",
};

interface AddChildToProphylaxisSessionSidebarProps extends DrawerProps {
  prophylaxisSessionId: string;
  prophylaxisSessionVersion: number;
  institutionId: string;
  allParticipants: ChildExamination[];
}

function AddChildToProphylaxisSessionSidebar(
  props: AddChildToProphylaxisSessionSidebarProps,
) {
  const {
    prophylaxisSessionId,
    prophylaxisSessionVersion,
    institutionId,
    allParticipants,
    onClose,
  } = props;
  const { mutateAsync: updateParticipants } =
    useUpdateProphylaxisSessionParticipants(prophylaxisSessionId);
  const snackbar = useSnackbar();

  const participantsIds = allParticipants.map(
    (childExamination) => childExamination.childId,
  );

  async function handleSubmit(
    values: AddChildToProphylaxisSessionSidebarFormFields,
  ) {
    await updateParticipants(
      {
        version: prophylaxisSessionVersion,
        participants: [...participantsIds, mapRequiredValue(values.selected)],
      },
      {
        onSuccess: () => {
          onClose();
          snackbar.confirmation("Kind erfolgreich hinzugefügt.");
        },
      },
    );
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <SidebarForm>
          <SidebarContent title="Kind hinzufügen">
            <Stack gap={2}>
              <InputField
                name="searchString"
                label={"Kind suchen"}
                startDecorator={<SearchRounded />}
                autoFocus
              />
              <SearchChildrenResults
                institutionId={institutionId}
                searchString={values.searchString}
                participantsIds={participantsIds}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Hinzufügen"
              onCancel={props.onClose}
              submitting={isSubmitting}
              submitDisabled={values.selected === ""}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function SearchChildrenResults(props: {
  institutionId: string;
  searchString: string;
  participantsIds: string[];
}) {
  const { institutionId, searchString, participantsIds } = props;
  const [debouncedSearchString] = useDebounce(searchString, 250, {
    trailing: true,
  });

  const {
    data: matches,
    isLoading,
    isSuccess,
  } = useSearchChildren(institutionId, debouncedSearchString);

  function childToResultCardProps(child: ChildSearchResult): ResultCardProps {
    const alreadyParticipating = participantsIds.includes(child.id);
    return {
      child,
      badge: alreadyParticipating ? <AlreadyParticipatingBadge /> : undefined,
      disabled: alreadyParticipating,
    };
  }

  return (
    <RadioGroupField name={RADIO_GROUP_FIELD_NAME}>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack gap={1}>
          {matches.map(childToResultCardProps).map((props) => (
            <ResultCard key={props.child.id} {...props} />
          ))}
        </Stack>
      )}
      {isSuccess && matches.length === 0 && (
        <NoSearchResults info="Kein Kind gefunden" />
      )}
    </RadioGroupField>
  );
}

interface ResultCardProps {
  child: ChildSearchResult;
  badge?: ReactNode;
  disabled?: boolean;
}

function ResultCard(props: ResultCardProps) {
  const { child, badge, disabled } = props;
  return (
    <SelectableCard
      key={child.id}
      value={child.id}
      forGroupName={RADIO_GROUP_FIELD_NAME}
      radioProps={{
        disabled,
      }}
    >
      <Stack gap={1}>
        <Typography component="h3" sx={{ fontWeight: "bold" }}>
          {formatPersonName(child)}
        </Typography>
        <TextWithIcon icon={Cake} text={formatDate(child.dateOfBirth)} />
        <TextWithIcon icon={Groups} text={child.groupName} />
        {badge}
      </Stack>
    </SelectableCard>
  );
}

function TextWithIcon(props: {
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">>;
  text: string;
}) {
  const { text, icon: IconComponent } = props;
  return (
    <Stack gap={1} direction="row">
      <IconComponent color="neutral" size="sm" />
      <Typography>{text}</Typography>
    </Stack>
  );
}

function Spinner() {
  return (
    <Stack alignItems="center" justifyContent="center" gap={2}>
      <CircularProgress aria-label="Suche Kinder…" />
    </Stack>
  );
}

function AlreadyParticipatingBadge() {
  return <Chip color="warning">Nimmt bereits teil</Chip>;
}
