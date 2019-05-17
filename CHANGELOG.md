## [1.0.6] - 2019-05-15
### Added
- CHANGELOG.md
- Arbitary options to all Pson functions
- Loop Segments util such as reverse orientation, flatten to points, check loop orientation, etc
- BoundingBox class
- Point.cross
- Point.length2 (for optimization)
- Test file

### Changed
- Added optional ccw flag to arrange group util
- Pson.packEntities to pack id only if not exists
- Line.interpolate to return endpoint as pointers instead of copy
- Line.contains now use a more consistence linear algorithm