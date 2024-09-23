test data for checklist defintions (CLDs)
=========================================

The files in this test data directory represent CLDs.

They must adhere to the structure of a CreateNewChecklistDefinitionRequest.

The filename must be one of the available object types in application
property `de.eshg.inspection.object-types.defaultObjectTypes`, plus suffix ".json",
e.g. "Ambulante medizinische Einrichtung.json" or "Krankenhaus.json". The filename must match in
case exactly. If you want multiple files for the same object type, use
numbering like "Krankenhaus.1.json", "Krankenhaus.2.json", etc.

The test data can be created and inserted into database using the following
request:
```
POST /test-helper/checklists/definitions/test-data
```

The POST payload body is either empty; in this case the endpoint creates
CLDs for *all* *.json files in this directory.

Or the POST payload body enumerates the CLDs to create:
```json
{"clds": ["Krankenhaus", "Ambulante medizinische Einrichtung.2"]}
```

On success, the CLDs are created in the database and are generally available.
The request also returns the created CLDs. 
