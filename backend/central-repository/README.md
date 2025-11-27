# Versioniertes Repository
Im Folgenden wird das Wort "Eintrag" (im Code `entry`) für die Sammlung aller Versionen, die zu einer bestimmten `id` gehören, benutzt. Ein Eintrag könnte zum Beispiel eine Checkliste namens "Checkliste zur infektionshygienischen Begehung von ambulanten Intensivpflegediensten (AIPD)" sein, die mehrere Versionen beinhaltet.

Der Hostname des zentralen Repository wird im Folgenden mit `repo` abgekürzt.

## Anforderungen
1. existierende Versionen dürfen nicht geändert werden; stattdessen wird eine neue Version angelegt
2. mehrere Fachmodule aus unterschiedlichen Ämtern müssen zusammen arbeiten können; genauer gesagt muss ein Fachmodul aus einem Amt eine neue Version auf Basis einer Version erstellen können, die von einem anderen Amt angelegt wurde
3. unterschiedliche Arten von Fachmodule sollen zusammen arbeiten können (z.B. `inspection` mit `measles`)
4. nach dem `tags` und dem `category` Feld kann gefiltert werden
5. es ist möglich nur die neuste Version für jeden Eintrag zu erhalten
6. der `name` eines Eintrags muss geändert werden können (aber nur durch eine neue Version)
7. Pflichtfelder sind `name` und `category` (bei Checklisten könnte es z.B. die Kategorien "Zahnarzt", "Nagelstudio" und "Krankenhaus" geben)

## Abfragen (READ)
### Beabsichtigte Einschränkungen
Es ist Absicht, dass es kein `GET repo/versioned/{moduleName}/{objectName}/{id}/{version}`, also keine Möglichkeit gibt sowohl Metadaten als auch den Inhalt gleichzeitig zu bekommen. Das ist unter anderem so, weil der Inhalt sehr groß sein und auch binär vorliegen kann. (z.B. eine ZIP-Datei)

Genauso gibt es bewusst keine Möglichkeit den Inhalt mehrerer Einträge bzw. mehrerer Versionen abzuholen.

### Inhalt einer Version eines Eintrags
```http request
GET repo/versioned/{moduleName}/{objectName}/{id}/{version}/content
```

Gibt den Inhalt der angeforderten Version im Response Body zurück. Dabei ist der `Content-Type` HTTP-Header abhängig vom gespeicherten `contentType` gesetzt.

**Pfadparameter**:

*
`moduleName` - Ein beliebiger Name, aber am besten der des Fachmoduls, was die Einträge verwaltet, z.B.
`inspection` für "Hygiene" (Wieso wird es nicht automatisch bestimmt? Siehe [Punkt 3 im Abschnitt Anforderungen](#Anforderungen))
* `objectName` - Ein beliebiger Name für Einträge, die hier gespeichert werden, z.B. `checklist` für Checklisten
* `id` - Eine fortlaufende ID, die von der Datenbank beim ersten Anlegen festgelegt wird
* `version` - Die Versionsnummer, die bei jeder neuen Version eines Eintrags höher sein muss

**Zusammengesetzter Primärschlüssel**:

Eine `id-version`-Kombination ist einzigartig, selbst wenn der `moduleName` or sonstiges anders ist. Es kann also nie ein `inspection/dentist/3/1` und ein `measles/list/3/1` geben. Dies mag komisch erscheinen (`3/1` würde ja ausreichen als Pfad). Es dient jedoch der Rechteverwaltung. Siehe Abschnitt [Rechte](#Rechte). Daher wird auch überprüft, ob eine `id-version`-Kombination wirklich dem angegebenen `moduleName` und `objectName` entspricht.

### Metadaten einer Version eines Eintrags
```http request
GET repo/versioned/{moduleName}/{objectName}/{id}/{version}/metadata
```

**Beispiel**:
```http request
GET repo/versioned/inspection/checklist/2333/2/metadata
```

→ Gibt zurück:<a name="fullexample"></a>

```json
{
  "id": 2333,
  "version": 2,
  "moduleName": "inspection",
  "objectName": "checklist",
  "category": "Zahnarzt",
  "name": "Zahnärzteüberprüfungskontrollliste",
  "tags": ["2024", "dentist", "requires-review"],
  "description": "eine sehr klare und ausführliche Checkliste ...",
  "changeLog": "Hab mal eine neue Checkbox hinzufügt",
  "contact": "MaxMustermann@cronn.de",
  "createdBy": "gesundheitsamt-hessen/begehung",
  "createdAt" : "2024-01-27T00:00:00.123456Z",
  "contentType": "application/json"
}
```

Die `tags` werden sortiert und in der Datenbank als komma-separierter String gespeichert. Sie dürfen kein Komma und nicht nur Whitespace enthalten.

Im `createdBy` Feld wird die `naturalId` vom Aktor gespeichert. Diese stellen wir fest, indem wir den `commonName` aus dem Request nehmen und uns dann damit vom Service Directory die Metadaten vom Aktor holen.

### Metadaten aller Versionen von einem Eintrag
```http request
GET repo/versioned/{moduleName}/{objectName}/{id}/metadata
```

**Beispiel**:
```http request
GET repo/versioned/inspection/checklist/2424/metadata
```

→ Gibt zurück:

```json
{
  "items": [
    {
      "id": 2424,
      "version": 1,
      "moduleName": "inspection",
      "objectName": "checklist",
      "category": "Nagelstudio",
      "name": "Nagelstudio Checklist",
      "createdBy": "gesundheitsamt-darmstadt/inspection",
      "createdAt" : "2024-02-27T00:00:00.123456Z",
      "contentType": "application/json"
    },
    {
      "id": 2424,
      "version": 2,
      "moduleName": "inspection",
      "objectName": "checklist",
      "category": "Nagelstudio",
      "name": "Nagelstudio Checklist nach ISO-123456 (neu)",
      "createdBy": "gesundheitsamt-hessen/inspection",
      "createdAt" : "2024-03-27T00:00:00.123456Z",
      "contentType": "application/json"
    }
  ]
}
```

Wenn es keine Versionen mit den festgelegten Parametern (hier `moduleName` und `objectName` und `id`) gibt, dann würde `items` natürlich eine leere Liste sein. →

```json
{
  "items": []
}
```

### Metadaten aller Versionen aller Einträge innerhalb einer Ebene
```http request
GET repo/versioned/{moduleName}/{objectName}/metadata
```

Der `objectName` kann hier und **nur hier** auch `*` sein, um alle Einträge mit einem bestimmten `moduleName` unabhängig von dessen `objectName` zu erhalten.

### Optionale Filter

* z.B. `GET repo/versioned/inspection/*/metadata?versions=NEWEST` → gibt eine Liste der Metadaten der neuesten Versionen der Checklisten für `inspection` zurück (also nur die höchste bzw. letzte Version zu jeder `id`)
* z.B. `GET repo/versioned/inspection/checklist/metadata?category=Zahnarzt` → gibt eine Liste der Checklisten für `inspection` zurück, die "Zahnarzt" als `category` haben
* z.B. `GET repo/versioned/inspection/checklist/metadata?tags=2024` → gibt eine Liste der Checklisten für `inspection` zurück, dessen `tags` Feld "2024" enthält (Dies ist mit einem einfachen `LIKE %:tag%` implementiert. Man kann also nur nach mehreren Tags suchen, wenn diese genauso hintereinanderstehen. Wenn eine Version beispielsweise `tags` auf `a,b,c` gesetzt hat, würde es `?tags=a,b`, `?tags=a,b,c` und `?tags=b,c` finden, aber nicht `?tags=a,c`)
* z.B. `GET repo/versioned/inspection/checklist/metadata?tags=` → gibt eine Liste der Checklisten für `inspection` zurück, dessen `tags` Feld leer ist
* z.B. `GET repo/versioned/inspection/checklist/metadata?deleted=true` → gibt eine Liste der Checklisten für `inspection` zurück, die als gelöscht markiert sind


## Anlegen
### Von einem neuen Eintrag (CREATE)
```http request
POST repo/versioned/{moduleName}/{objectName}
```

Benötigt einen HTTP Multipart Request mit JSON-Objekt der Metadaten als ersten Teil und den Inhalt des Eintrags (z.B. Checkliste oder Zip-Datei) als zweiten Teil. Dabei muss der `Content-Type` und die `Content-Disposition` für beide Teile gesetzt sein. Für den Metadaten-Teil muss die `Content-Disposition` den Namen "metadata" haben, und für den Inhalt den Namen "content". Wenn diese beiden Namen in der `Content-Disposition` fehlen, wird der Request abgelehnt.

**Beispiel**:

Die Metadaten hier enthalten nur die notwendigen Felder. Für ein Beispiel mit allen Feldern, siehe [Abschnitt Abfragen](#fullexample).

```http request
POST repo/versioned/inspection/checklist`
Content-Type: multipart/form-data; boundary=07758748-62b8-4c4f-87ca-cb443b5d93ba

--07758748-62b8-4c4f-87ca-cb443b5d93ba
Content-Disposition: form-data; name="metadata"
Content-Type: application/json

{
  "category": "Pflegedienste",
  "name": "Checkliste zur infektionshygienischen Begehung von ambulanten Intensivpflegediensten (AIPD)"
}

--07758748-62b8-4c4f-87ca-cb443b5d93ba
Content-Disposition: form-data; name="content"
Content-Type: application/json

{
  "checks": [
    {
      "desc": "Is this clean?",
      "type": "boolean"
    }
  ]
}
--07758748-62b8-4c4f-87ca-cb443b5d93ba--
```

→ Gibt die Metadaten für den angelegten Eintrag (also dessen erste Version) zurück, die auch die `id` enthält, welche genutzt werden kann, um neue Versionen anzulegen:

```json
{
  "id": 2424,
  "version": 1,
  "moduleName": "inspection",
  "objectName": "checklist",
  "category": "Pflegedienste",
  "name": "Checkliste zur infektionshygienischen Begehung von ambulanten Intensivpflegediensten (AIPD)",
  "tags":  [],
  "contentType": "application/json",
  "createdBy": "gesundheitsamt-hessen/begehung",
  "createdAt" : "2024-02-01T00:00:00.123456Z"
}
```

**Beispiel mit cURL für das lokale Testen**:

Im Folgenden muss `XXX` mit dem "common name" eines Actors, der in der Service Directory Datenbank existiert, ersetzt werden. Um sich einen oder mehrere Aktoren anzulegen, kann man die `PopulateApplication` vom `service-directory`-Modul starten. Dann muss man in die `service-directory-db` gehen und sich in aus der `audited_actor` Tabelle einen `common_name` kopieren

`curl -v -X POST --header "x-eshg-cert-subject: CN=XXX" -F 'metadata=@C:\Users\max_mustermann\eshg-backend\central-repository\src\test\resources\metadata.json;type=application/json' -F 'content=@C:\Users\max_mustermann\eshg-backend\central-repository\src\test\resources\test.png;type=image/png' http://localhost:8091/versioned/mod/obj`

Und hier ein weiteres Beispiel mit JSON direkt angegeben:

`curl -X POST --header "x-eshg-cert-subject: CN=XXX" -v -F 'metadata={"category":"Ambulante medizinische Einrichtung","name":"Arztpraxen Checklist"};type=application/json' -F 'content={"is_clean":"boolean"};type=application/json' http://localhost:8091/versioned/inspection/checklist`

### Neue Version eines Eintrags (quasi UPDATE)
```http request
POST repo/versioned/{moduleName}/{objectName}/{id}/{basedOnVersion}
```

→ Gibt die Metadaten der neuen Version zurück

* muss genauso ein HTTP Multipart Request mit Metadaten und Inhalt sein
* `basedOnVersion` ist die Version auf der dieser Request basiert
* die `version` aus der Rückgabe benötigt man, um auf die neue Version zuzugreifen

#### Optimistisches Locking
Das `basedOnVersion` Feld dient als optimistisches Locking. Wenn das zentrale Repository schon eine nicht-gelöschte höhere Version findet, wird der Server eine `409 Conflict` Status mitsamt einer Fehlermeldung zurückgeben.

**Beispiel**:

Sagen wir mal, wir haben einen Eintrag `42` mit den folgenden Versionen:

`1 -> 2 -> 3 (gelöscht) -> 4 (gelöscht)`

* Ein `POST repo/versioned/a/b/42/2` würde jetzt Version `5` anlegen, da `3` und `4` zwar existieren aber schon gelöscht sind.
* Ein `POST repo/versioned/a/b/42/1` würde mit einer `409 Conflict` fehlschlagen, da es schon `2` gibt.

### Nur Metadaten anpassen (neue Version)
```http request
POST repo/versioned/{moduleName}/{objectName}/{id}/{basedOnVersion}/metadata
```

Benötigt nur ein JSON der Metadaten als Body (ansonsten gleich)

## Löschen (Soft DELETE)
Es werden keine Einträge direkt gelöscht, sondern nur als gelöscht markiert.

Wenn ein Eintrag als gelöscht markiert ist, hat es auch noch die Metadaten-Felder `deletedBy` (ebenfalls die `naturalId`) und `deletedAt`.

### Einen Eintrag bzw. alle dessen Versionen
```http request
DELETE repo/versioned/{moduleName}/{objectName}/{id}
```

### Eine Version eines Eintrags
```http request
DELETE repo/versioned/{moduleName}/{objectName}/{id}/{version}
```

## Rechte
Fachlogik und Rechteverwaltung sind im zentralen Repository nicht gewünscht. Daher haben wir uns entschieden, dies über das Service-Directory zu handhaben. Dort wird man über die Admin-API festlegen können, ob bestimmte Pfade bei bestimmten HTTP-Methoden von ausgewählten Modulen aufgerufen werden dürfen oder nicht.

Wenn ein Modul wie z.B. Begehung (`inspection`) Checklisten hat, die nur von einem Modul im Landesamt bearbeitet werden dürfen (sogenannte Kern-Checklisten), dann muss es seine Einträge unter zwei Pfaden ablegen (`checklist` und `kernel_checklist`) und dann von Administratoren im Service-Directory folgende Regeln anlegen lassen.

* jedes Modul "Hygiene" darf
  * `GET`/`PUT`/`POST repo/versioned/inspection/checklist/*` aufrufen
  * `GET repo/versioned/inspection/kernel_checklist/*` aufrufen
* nur das Modul "Hygiene" aus dem Landesamt darf
  * `PUT`/`POST`/`DELETE repo/versioned/inspection/kernel_checklist/*` aufrufen
  * `DELETE repo/versioned/inspection/checklist/*` aufrufen
