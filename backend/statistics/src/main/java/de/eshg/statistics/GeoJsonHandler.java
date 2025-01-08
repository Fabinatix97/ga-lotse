/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.error.BadRequestException;
import java.util.List;
import java.util.Map;

public class GeoJsonHandler {
  private static final String KEY_GEOMETRY = "geometry";
  private static final String KEY_TYPE = "type";
  private static final String KEY_FEATURES = "features";
  private static final String KEY_COORDINATES = "coordinates";
  private static final String KEY_PROPERTIES = "properties";
  private static final String KEY_NAME = "name";
  private static final String FIRST_LEVEL_PROPERTY_MISSING_MESSAGE = "GeoJson.%s is missing";
  private static final String SECOND_LEVEL_PROPERTY_MISSING_MESSAGE =
      "GeoJson.%s[%d].%s is missing";
  private static final String THIRD_LEVEL_PROPERTY_MISSING_MESSAGE =
      "GeoJson.%s[%d].%s.%s is missing";

  private GeoJsonHandler() {}

  public static void validateGeoJson(String geoJson) {
    Map<String, Object> geoJsonMap = mapToGeoJsonMap(geoJson);

    if (notContainsOrNull(geoJsonMap, KEY_TYPE)) {
      geoJsonBadRequest(FIRST_LEVEL_PROPERTY_MISSING_MESSAGE.formatted(KEY_TYPE));
    }

    if (!geoJsonMap.get(KEY_TYPE).equals("FeatureCollection")) {
      geoJsonBadRequest(
          "Value 'FeatureCollection' expected for property GeoJson.%s".formatted(KEY_TYPE));
    }

    if (notContainsOrNull(geoJsonMap, KEY_FEATURES)) {
      geoJsonBadRequest(FIRST_LEVEL_PROPERTY_MISSING_MESSAGE.formatted(KEY_FEATURES));
    }

    if (!(geoJsonMap.get(KEY_FEATURES) instanceof List<?>)) {
      geoJsonBadRequest("Array expected for property GeoJson.%s".formatted(KEY_FEATURES));
    }

    List<?> features = (List<?>) geoJsonMap.get(KEY_FEATURES);
    int index = 0;
    for (Object feature : features) {
      validateFeature(feature, index);
      index++;
    }
  }

  private static Map<String, Object> mapToGeoJsonMap(String geoJsonString) {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      return objectMapper.readValue(geoJsonString, new TypeReference<>() {});
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Invalid JSON for the geo shape.");
    }
  }

  private static boolean notContainsOrNull(Map<?, ?> map, Object key) {
    return !map.containsKey(key) || map.get(key) == null;
  }

  private static void validateFeature(Object feature, int index) {
    if (!(feature instanceof Map)) {
      geoJsonBadRequest("GeoJson.%s[%d] expected to be an object".formatted(KEY_FEATURES, index));
    }

    Map<?, ?> featureMap = (Map<?, ?>) feature;
    if (notContainsOrNull(featureMap, KEY_TYPE)) {
      geoJsonBadRequest(
          SECOND_LEVEL_PROPERTY_MISSING_MESSAGE.formatted(KEY_FEATURES, index, KEY_TYPE));
    }
    if (featureMap.get(KEY_TYPE).equals("Feature")) {
      validateGeometry(index, featureMap);
      validateProperties(index, featureMap);
    }
  }

  private static void validateGeometry(int index, Map<?, ?> featureMap) {
    validatePropertyExistsAndIsMap(index, featureMap, KEY_GEOMETRY);

    Map<?, ?> geometryMap = (Map<?, ?>) featureMap.get(KEY_GEOMETRY);
    if (notContainsOrNull(geometryMap, KEY_TYPE)) {
      geoJsonBadRequest(
          THIRD_LEVEL_PROPERTY_MISSING_MESSAGE.formatted(
              KEY_FEATURES, index, KEY_GEOMETRY, KEY_TYPE));
    }
    if (notContainsOrNull(geometryMap, KEY_COORDINATES)) {
      geoJsonBadRequest(
          THIRD_LEVEL_PROPERTY_MISSING_MESSAGE.formatted(
              KEY_FEATURES, index, KEY_GEOMETRY, KEY_COORDINATES));
    }
  }

  private static void validatePropertyExistsAndIsMap(int index, Map<?, ?> map, String key) {
    if (notContainsOrNull(map, key)) {
      geoJsonBadRequest(SECOND_LEVEL_PROPERTY_MISSING_MESSAGE.formatted(KEY_FEATURES, index, key));
    }
    if (!(map.get(key) instanceof Map)) {
      geoJsonBadRequest(
          "GeoJson.%s[%d].%s expected to be an object".formatted(KEY_FEATURES, index, key));
    }
  }

  private static void validateProperties(int index, Map<?, ?> featureMap) {
    validatePropertyExistsAndIsMap(index, featureMap, KEY_PROPERTIES);

    Map<?, ?> propertiesMap = (Map<?, ?>) featureMap.get(KEY_PROPERTIES);
    if (notContainsOrNull(propertiesMap, KEY_NAME)) {
      geoJsonBadRequest(
          THIRD_LEVEL_PROPERTY_MISSING_MESSAGE.formatted(
              KEY_FEATURES, index, KEY_PROPERTIES, KEY_NAME));
    }
  }

  private static void geoJsonBadRequest(String message) {
    throw new BadRequestException("Invalid geo json. %s.".formatted(message));
  }

  public static List<String> getGeoKeys(String geoJson) {
    Map<String, Object> geoJsonMap = GeoJsonHandler.mapToGeoJsonMap(geoJson);
    List<?> features = (List<?>) geoJsonMap.get(GeoJsonHandler.KEY_FEATURES);

    return features.stream()
        .filter(feature -> feature instanceof Map<?, ?>)
        .map(feature -> ((Map<?, ?>) feature).get(GeoJsonHandler.KEY_PROPERTIES))
        .filter(properties -> properties instanceof Map<?, ?>)
        .map(properties -> ((Map<?, ?>) properties).get(GeoJsonHandler.KEY_NAME))
        .map(String::valueOf)
        .toList();
  }
}
