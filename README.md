# pson
Small library for parsing [pson](https://github.com/PackPlay/workflow-decider/blob/master/PSON.md)

# PSON Schema Specification v1.0

## Introduction

PSON is a JSON schema that describes a [dieline][3] and folding method.


### Glossary

* **box** - refer to all packaging box that is constructed by folding.
* **dieline** - a [blueprint][1] of a box 
* **cut** - a part of dieline where cutting is made ([pink][1]) 
* **crease** - a part of dieline where folding happens ([dashed blue][1])
* **bone** - a 3D animator used in folding dieline via any arbitary 3D software. Usually refer to [armature][4] object in [Blender][5].
* **panel** - a face in dieline. Usually separated by folding *crease* (i.e. this [blueprint][2] has 13 *panels*)

[1]: http://www.craigkunce.com/packaging/tabasco_final_die.gif
[2]: https://i.pinimg.com/236x/f1/08/43/f1084301f84817ff2369d08af8bf20d4--shapes-for-kids-shape-activities.jpg
[3]: http://www.boxprintingcompany.com/Technical-Supports/images/Why-need-the-Box-Design.jpg
[4]: https://docs.blender.org/manual/en/dev/rigging/armatures/index.html
[5]: https://www.blender.org/
## Data Structure

### Top-level structure

* **cut** - Array of entity reference id that are part of cut
* **crease** - Array of entity reference id that are part of crease
* **bone** - Array of entity reference id that act as 3D folding. The array will almost always consists of only 1 `Graph` Entity.
* **entities** - Array of all entities that are used in this file. Each entity can be reused by referencing its id. There are many type of entity, at which, all must be derived from `Entity` class.
* **metadata** - Map of metadata objects. For example,  `parameters` or `styleId` should be attached to PSON to tell us more about source CAD file.
* **panels** (optional) - Array of `Panel` objects. Each `Panel` generally contains all the `Point` for one box's panel.

``` json
{
    "cut": ["<Entity ID>"],
    "crease": ["<Entity ID>"],
    "bone": ["<Entity ID>"],
    "entities": ["<Entity Object>"],
    "metadata": {
        "styleId": "<style id>",
        "parameters": {}
    },
    "panels": ["<Panel Object>"]
}
```

### Basic Class

All classes must derived from `Entity` class. 

`<X>` refers to using ID reference to an object of class X. (i.e. `"x": "<Point>"` refers to setting `x` to `Point.id` of an arbitary `Point` object)


`{...X}` refers to [spreading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) structure of class X.


#### Entity
Every classes must be derived from `Entity` class. 

* `id` - any unique number or string that represent this entity
* `className` - represent name of this entity's class. For example, if the entity is instantiated from `Point` class then its class name should be `Point`.

```json
{
    "id": "unique-id",
    "className": "ClassName"
}
```

#### Point (Entity)
```json
{
    "x": 10.0,
    "y": 10.0
}
```

#### Line (Entity)
```json
{
    "a": "<Point>", 
    "b": "<Point>"
}
```

#### Arc (Entity)
```json
{
    "radius": 10.0,
    "center": "<Point>",
    "a": "<Point>",
    "b": "<Point>"
}
```

### Collection Class

#### Graph (Entity)
```json
{
    "data": "<Point>",
    "children": ["{...Graph}"]
}
```

#### Panel (Entity)
```json
{
    "outer": ["<Point>"],
    "inner": ["<Polyline|Line|Arc>"],
    "metadata": {}
}
```