/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CakeOutlined,
  GroupsOutlined,
  SearchRounded,
} from "@mui/icons-material";
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

import {
  FormButtonBar,
  NoSearchResults,
  SelectableCard,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  InputField,
  OptionalFieldValue,
  RadioGroupField,
  formatDate,
  formatPersonName,
  mapRequiredValue,
  useSnackbar,
} from "@eshg/lib-portal";

import { ChildSearchResult } from "../../../children/api/models/ChildSearchResult";
import { useSearchChildren } from "../../../children/api/queries/overview";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";
import { useUpdateProphylaxisSessionParticipants } from "../../api/mutations/details";

export function useAddChildToProphylaxisSessionSidebar(): UseSidebarWithFormRefResult<AddChildToProphylaxisSessionSidebarProps> {
  return useSidebarWithFormRef({
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

interface AddChildToProphylaxisSessionSidebarProps
  extends SidebarWithFormRefProps {
  prophylaxisSessionId: string;
  prophylaxisSessionVersion: number;
  institutionId: string;
  allParticipants: ProphylaxisSessionExamination[];
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
    (childExamination) => childExamination.id,
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
          onClose(true);
          snackbar.confirmation("Kind erfolgreich hinzugefügt.");
        },
      },
    );
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Kind hinzufügen">
            <Stack gap={2}>
              <InputField
                name="searchString"
                label="Kind suchen"
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
              submitting={isSubmitting}
              submitDisabled={values.selected === ""}
              onCancel={props.onClose}
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
      radioProps={{
        disabled,
      }}
    >
      <Stack gap={1}>
        <Typography component="h3" sx={{ fontWeight: "bold" }}>
          {formatPersonName(child)}
        </Typography>
        <TextWithIcon
          icon={CakeOutlined}
          text={formatDate(child.dateOfBirth)}
        />
        <TextWithIcon icon={GroupsOutlined} text={child.groupName ?? ""} />
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
