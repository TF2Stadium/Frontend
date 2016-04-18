/*global module */
module.exports = {
  cleanupAttrs: true, //  cleanup attributes from newlines, trailing and repeating spaces
  removeDoctype: true, //  remove doctype declaration
  removeXMLProcInst: true, //  remove XML processing instructions
  removeComments: true, //  remove comments
  removeMetadata: true, //  remove <metadata>
  removeTitle: true, //  remove <title> (disabled by default)
  removeDesc: true, //  remove <desc> (only non-meaningful by default)
  removeUselessDefs: true, //  remove elements of <defs> without id
  removeEditorsNSData: true, //  remove editors namespaces, elements and attributes
  removeEmptyAttrs: true, //  remove empty attributes
  removeHiddenElems: true, //  remove hidden elements
  removeEmptyText: true, //  remove empty Text elements
  removeEmptyContainers: true, //  remove empty Container elements
  removeViewBox: true, //  remove viewBox attribute when possible (disabled by default)
  cleanUpEnableBackground: true, //  remove or cleanup enable-background attribute when possible
  minifyStyles: true, //  minify <style> elements content with CSSO
  convertStyleToAttrs: true, //  convert styles into attributes
  convertColors: true, //  convert colors (from rgb() to #rrggbb, from #rrggbb to #rgb)
  convertPathData: true, //  convert Path data to relative or absolute whichever is shorter, convert one segment to another, trim useless delimiters, smart rounding and much more
  convertTransform: true, //  collapse multiple transforms into one, convert matrices to the short aliases and much more
  removeUnknownsAndDefaults: true, //  remove unknown elements content and attributes, remove attrs with default values
  removeNonInheritableGroupAttrs: true, //  remove non-inheritable group's "presentation" attributes
  removeUselessStrokeAndFill: true, //  remove useless stroke and fill attrs
  removeUnusedNS: true, //  remove unused namespaces declaration
  cleanupIDs: false, //  remove unused and minify used IDs
  cleanupNumericValues: true, //: true, //  round numeric values to the fixed precision, remove default 'px' units
  cleanupListOfValues: true, //  round numeric values in attributes that take a list of numbers, like viewBox or enableBackground
  moveElemsAttrsToGroup: true, //  move elements attributes to the existing group wrapper
  moveGroupAttrsToElems: true, //  move some group attributes to the content elements
  collapseGroups: true, //  collapse useless groups
  removeRasterImages: true, //  remove raster images (disabled by default)
  mergePaths: true, //  merge multiple Paths into one
  convertShapeToPath: true, //  convert some basic shapes to path
  sortAttrs: true, //  sort element attributes for epic readability (disabled by default)
  transformsWithOnePath: true, //  apply transforms, crop by real width, center vertical alignment and resize SVG with one Path inside (disabled by default)
  removeDimensions: true, //: true, //  remove width/height attributes if viewBox is present (disabled by default)
  removeAttrs: true, //  remove attributes by pattern (disabled by default)
  addClassesToSVGElement: true, //  add classnames to an outer <svg> element (disabled by default)
  removeStyleElement: true, //  remove <style> elements (disabled by default)
};
