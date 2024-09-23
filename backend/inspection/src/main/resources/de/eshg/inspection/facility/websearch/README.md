OSM Testdata
============

The files in this directory have been downloaded from the
[Geofabrik Download Server](https://download.geofabrik.de/europe/germany/bremen.html).

They are served with test-helper and should be available under e.g. [this URL](http://localhost:8081/test-data/osm/test-data/frankfurt-2024-03-13-named-entries.osm.pbf).

To reduce their size (~19mb), the files have been filtered and stripped down using 
[Osmfilter](https://wiki.openstreetmap.org/wiki/Osmfilter) and
[Osmconvert](https://wiki.openstreetmap.org/wiki/Osmconvert). Only the nodes
which contain the attributes "name", "addr:postcode" and "addr:city" have been
left, because the inspection module ignores all other entries anyway.

For reference, the files have been created as follows:

```bash
# download bremen data:
$ curl https://download.geofabrik.de/europe/germany/bremen-latest.osm.pbf

# convert to *.osm:
$ osmconvert bremen-latest.osm.pbf -o=bremen-latest.osm

# keep only nodes have name, postalCode and city:
$ osmfilter bremen-latest.osm --keep= --keep-nodes="name= and addr:postcode= and addr:city=" -o=bremen-named-entries.osm

# convert back to *.pbf:
$ osmconvert bremen-named-entries.osm -o=bremen-named-entries.osm.pbf
```
