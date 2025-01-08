/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import static de.eshg.base.util.PersonDiffer.isPersonMatch;

import com.google.common.collect.Sets;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.base.centralfile.persistence.entity.Person;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

final class PersonBulkUpdateHelper {

  private static final Logger log = LoggerFactory.getLogger(PersonBulkUpdateHelper.class);

  private PersonBulkUpdateHelper() {}

  static List<UUID> collectUpdatesOnOutdatedFileStates(Collection<Person> fileStatesForUpdate) {
    List<UUID> outdatedFileStateIds =
        fileStatesForUpdate.stream()
            .filter(
                fileStateForUpdate ->
                    PersonService.isPersonFileStateOutdated(
                        fileStateForUpdate, fileStateForUpdate.getReferencePerson()))
            .map(Person::getExternalId)
            .toList();

    if (!outdatedFileStateIds.isEmpty()) {
      log.warn(
          "The following file states are outdated and were thus not updated: {}",
          outdatedFileStateIds);
    }

    return outdatedFileStateIds;
  }

  static List<UUID> collectUpdatesOnSameReference(Collection<Person> fileStatesForUpdate) {
    Set<Person> processedReferencePersons = new LinkedHashSet<>();
    List<UUID> fileStatesWithSameReferences = new ArrayList<>();

    for (Person fileStateForUpdate : fileStatesForUpdate) {
      Person referencePerson = fileStateForUpdate.getReferencePerson();

      if (!processedReferencePersons.add(referencePerson)) {
        fileStatesWithSameReferences.add(fileStateForUpdate.getExternalId());
      }
    }

    if (!fileStatesWithSameReferences.isEmpty()) {
      log.warn(
          "The following person file states are not updated because their reference persons are already intended to be updated by another person file state: {}",
          fileStatesWithSameReferences);
    }

    return fileStatesWithSameReferences;
  }

  static List<UUID> collectUpdatesWithOverlappingData(Map<UUID, Person> fileStateUpdatesById) {
    Map<PersonKeyAttributes, List<UUID>> updatesByPersonKeyAttributes =
        groupByPersonKeyAttributes(fileStateUpdatesById);

    List<UUID> personUpdatesWithOverlappingData = new ArrayList<>();
    for (Map.Entry<PersonKeyAttributes, List<UUID>> entry :
        updatesByPersonKeyAttributes.entrySet()) {
      List<UUID> ids = entry.getValue();
      for (int i = 0; i < ids.size(); i++) {
        for (int j = i + 1; j < ids.size(); j++) {
          UUID id1 = ids.get(i);
          UUID id2 = ids.get(j);
          Person fileStateUpdate1 = fileStateUpdatesById.get(id1);
          Person fileStateUpdate2 = fileStateUpdatesById.get(id2);
          if (isPersonMatch(fileStateUpdate1, fileStateUpdate2)) {
            log.warn(
                "Skipping update for the following person file states due to their overlapping update data"
                    + " (to avoid references with identical person data after the update): {}, {}",
                id1,
                id2);
            personUpdatesWithOverlappingData.add(id1);
            personUpdatesWithOverlappingData.add(id2);
          }
        }
      }
    }

    return personUpdatesWithOverlappingData;
  }

  static Set<UUID> collectMissingIds(
      Set<UUID> existingFileStateIds, Set<UUID> fileStateForUpdateIds) {
    Set<UUID> missingFileStateIds = Sets.difference(fileStateForUpdateIds, existingFileStateIds);

    if (!missingFileStateIds.isEmpty()) {
      log.warn("The following file states could not be found and updated: {}", missingFileStateIds);
    }

    return missingFileStateIds;
  }

  static List<UUID> collectUpdatesWithSameDataAsExistingReferencePersons(
      Map<UUID, Person> fileStateUpdatesById, List<Person> referencePersonMatches) {
    Map<PersonKeyAttributes, List<UUID>> updatesByPersonKeyAttributes =
        groupByPersonKeyAttributes(fileStateUpdatesById);

    List<UUID> updatesWithExistingData = new ArrayList<>();
    for (Person referencePersonMatch : referencePersonMatches) {
      PersonKeyAttributes keyAttributesReferencePersonMatch =
          PersonService.personKeyAttributesOf(referencePersonMatch);
      for (UUID fileStateForUpdateId :
          updatesByPersonKeyAttributes.getOrDefault(keyAttributesReferencePersonMatch, List.of())) {
        if (isPersonMatch(fileStateUpdatesById.get(fileStateForUpdateId), referencePersonMatch)) {
          updatesWithExistingData.add(fileStateForUpdateId);
        }
      }
    }

    if (!updatesWithExistingData.isEmpty()) {
      log.warn(
          "Skipping updates for the following person file states as reference persons with the same person data were found"
              + "(to avoid references with identical person data after the update): {} ",
          updatesWithExistingData);
    }

    return updatesWithExistingData;
  }

  private static Map<PersonKeyAttributes, List<UUID>> groupByPersonKeyAttributes(
      Map<UUID, Person> fileStateUpdatesById) {
    return fileStateUpdatesById.entrySet().stream()
        .collect(
            Collectors.groupingBy(
                entry -> PersonService.personKeyAttributesOf(entry.getValue()),
                LinkedHashMap::new,
                Collectors.mapping(Map.Entry::getKey, Collectors.toList())));
  }
}
