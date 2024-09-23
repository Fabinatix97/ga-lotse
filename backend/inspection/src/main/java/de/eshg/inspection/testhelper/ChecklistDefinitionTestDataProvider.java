/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.inspection.checklistdefinition.ChecklistDefinitionService;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.checklistdefinition.api.CreateNewChecklistDefinitionRequest;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.rest.service.error.BadRequestException;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

@Component
public class ChecklistDefinitionTestDataProvider {

  private static final String CLD_TESTDATA_PACKAGE =
      "/de/eshg/inspection/checklistdefinition/testdata";

  private final ChecklistDefinitionService checklistDefinitionService;
  private final ObjectTypeRepository objectTypeRepository;
  private final ObjectMapper objectMapper;
  private final List<CreateNewChecklistDefinitionRequest> testList;

  protected ChecklistDefinitionTestDataProvider(
      ChecklistDefinitionService checklistDefinitionService,
      ObjectTypeRepository objectTypeRepository,
      ObjectMapper objectMapper) {
    this.checklistDefinitionService = checklistDefinitionService;
    this.objectTypeRepository = objectTypeRepository;
    this.objectMapper = objectMapper;
    this.testList = new ArrayList<>();
  }

  public List<ChecklistDefinitionDto> createTestCLDs() {
    return getTestList().stream().map(this::createTestCLD).toList();
  }

  public ChecklistDefinitionDto createTestCLD(int index) {
    int size = getTestList().size();
    int listIndex = index % size;
    CreateNewChecklistDefinitionRequest cldRequest = getTestList().get(listIndex);
    if (index >= size) {
      // modify cld name to make it unique
      cldRequest = cldRequest.withName(cldRequest.name() + "-" + (index / size + 1));
    }
    return createTestCLD(cldRequest);
  }

  public synchronized void clearTestCLDs() {
    this.testList.clear();
  }

  private synchronized List<CreateNewChecklistDefinitionRequest> getTestList() {
    if (testList.isEmpty()) {
      this.testList.addAll(createList());
    }
    return this.testList;
  }

  public List<CreateNewChecklistDefinitionRequest> createList() {
    List<Resource> resources = getAllTestCLDResources();
    return resources.stream()
        .map(this::load)
        .sorted(Comparator.comparing(CreateNewChecklistDefinitionRequest::name))
        .toList();
  }

  public ChecklistDefinitionDto createTestCLD(CreateNewChecklistDefinitionRequest cldRequest) {
    return checklistDefinitionService.createNewChecklistDefinition(cldRequest);
  }

  private List<Resource> getAllTestCLDResources() {
    try {
      PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
      String locationPattern = "classpath:" + CLD_TESTDATA_PACKAGE + "/*.json";
      Resource[] resources = resolver.getResources(locationPattern);
      if (resources.length == 0)
        throw new BadRequestException("no resources found in: " + locationPattern);
      return List.of(resources);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private CreateNewChecklistDefinitionRequest load(Resource resource) {
    try {
      ObjectType objectType = findObjectType(resource);
      String content = resource.getContentAsString(UTF_8);
      return objectMapper
          .readValue(content, CreateNewChecklistDefinitionRequest.class)
          .withObjectTypeId(objectType.getId());
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private ObjectType findObjectType(Resource resource) {
    String filename = extractFilename(resource);
    return objectTypeRepository
        .findByName(filename)
        .orElseThrow(
            () ->
                new BadRequestException(
                    "objectType \"" + filename + "\" not found for test resource: " + resource));
  }

  /**
   * Extracts only the pure filename from a resource without extension, e.g. if the resource is
   * "/foo/bar/baz.1.json" the method returns "baz".
   */
  private static String extractFilename(Resource resource) {
    String filename = resource.getFilename();
    assert filename != null;
    int pos1 = Math.max(filename.lastIndexOf('/'), 0);
    int pos2 = filename.indexOf('.', pos1);
    return filename.substring(pos1, pos2);
  }
}
