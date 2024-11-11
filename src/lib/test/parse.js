"use strict";
// Demonstrates extracting complete props info, using real TypeScript
// compiler type info.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
//
var ts = require("typescript");
var fs = require("fs");
var path = require("path");
// Arguments:
// 0. node
// 1. this script
// 2. filename to examine
// 3. [tsconfig file]
var filename = process.argv[2];
var tsconfigFilename = process.argv[3];
var compilerOptions = {};
console.log("Parsing " + filename);
if (tsconfigFilename) {
  console.log(" using tsconfig from " + tsconfigFilename);
  var configJson = JSON.parse(fs.readFileSync(tsconfigFilename, "utf8"));
  var basePath = path.dirname(tsconfigFilename);
  var _a = ts.convertCompilerOptionsFromJson(
      configJson.compilerOptions,
      basePath,
      tsconfigFilename,
    ),
    options = _a.options,
    errors = _a.errors;
  if (errors && errors.length) {
    try {
      for (
        var errors_1 = tslib_1.__values(errors), errors_1_1 = errors_1.next();
        !errors_1_1.done;
        errors_1_1 = errors_1.next()
      ) {
        var error = errors_1_1.value;
        console.error(error);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (errors_1_1 && !errors_1_1.done && (_b = errors_1.return))
          _b.call(errors_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    process.exit(5);
  }
  compilerOptions = options;
} else {
  console.log(" no tsconfig file specified - using default options");
}
var program = ts.createProgram([filename], compilerOptions);
console.log("Root file names:", program.getRootFileNames());
var checker = program.getTypeChecker();
try {
  for (
    var _c = tslib_1.__values(program.getRootFileNames()), _d = _c.next();
    !_d.done;
    _d = _c.next()
  ) {
    var rootFilename = _d.value;
    var source = program.getSourceFile(rootFilename);
    // Find the actual exports from the source file; we don't care about
    // anything that isn't exported.
    var moduleSymbol = checker.getSymbolAtLocation(source);
    var exports_1 = checker.getExportsOfModule(moduleSymbol);
    try {
      for (
        var exports_2 = tslib_1.__values(exports_1),
          exports_2_1 = exports_2.next();
        !exports_2_1.done;
        exports_2_1 = exports_2.next()
      ) {
        var exp = exports_2_1.value;
        // The original export name; may be named or 'default'
        var exportName = exp.getName();
        // If it's the "default" export, the component is named after the file without
        // its extension.
        var componentName =
          exportName === "default"
            ? path.basename(source.fileName, path.extname(source.fileName))
            : exportName;
        var type = checker.getTypeOfSymbolAtLocation(exp, exp.valueDeclaration);
        // We don't really know what we have at this point. Could be a constant, or an interface,
        // or anything.
        var callSignatures = type.getCallSignatures();
        var constructSignatures = type.getConstructSignatures();
        if (callSignatures.length) {
          try {
            // Could be a stateless component.  Is a function, so the props object we're interested
            // in is the (only) parameter.
            for (
              var callSignatures_1 = tslib_1.__values(callSignatures),
                callSignatures_1_1 = callSignatures_1.next();
              !callSignatures_1_1.done;
              callSignatures_1_1 = callSignatures_1.next()
            ) {
              var sig = callSignatures_1_1.value;
              var params = sig.getParameters();
              if (params.length !== 1) {
                continue;
              }
              // We've found an exported function with a single parameter.
              // Might be a stateless component. For now this is fine, but we could
              // theoretically check its return type to see if it's ReactElement or friends.
              var propsParam = params[0];
              dumpComponentInfo(componentName, propsParam);
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (
                callSignatures_1_1 &&
                !callSignatures_1_1.done &&
                (_e = callSignatures_1.return)
              )
                _e.call(callSignatures_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
        if (constructSignatures.length) {
          try {
            // React.Component. Is a class, so the props object we're interested
            // in is the type of 'props' property of the object constructed by the class.
            for (
              var constructSignatures_1 = tslib_1.__values(constructSignatures),
                constructSignatures_1_1 = constructSignatures_1.next();
              !constructSignatures_1_1.done;
              constructSignatures_1_1 = constructSignatures_1.next()
            ) {
              var sig = constructSignatures_1_1.value;
              var instanceType = sig.getReturnType();
              var props = instanceType.getProperty("props");
              if (!props) {
                // No props. Not a React component!
                continue;
              }
              dumpComponentInfo(componentName, props);
            }
          } catch (e_3_1) {
            e_3 = { error: e_3_1 };
          } finally {
            try {
              if (
                constructSignatures_1_1 &&
                !constructSignatures_1_1.done &&
                (_f = constructSignatures_1.return)
              )
                _f.call(constructSignatures_1);
            } finally {
              if (e_3) throw e_3.error;
            }
          }
        }
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (exports_2_1 && !exports_2_1.done && (_g = exports_2.return))
          _g.call(exports_2);
      } finally {
        if (e_4) throw e_4.error;
      }
    }
  }
} catch (e_5_1) {
  e_5 = { error: e_5_1 };
} finally {
  try {
    if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
  } finally {
    if (e_5) throw e_5.error;
  }
}
function dumpComponentInfo(componentName, propsObj) {
  var propsType = checker.getTypeOfSymbolAtLocation(
    propsObj,
    propsObj.valueDeclaration,
  );
  var propertiesOfProps = propsType.getProperties();
  console.log("Component " + componentName + ":");
  propertiesOfProps.forEach(function (prop) {
    var propName = prop.getName();
    // Find type of prop by looking in context of the props object itself.
    var propType = checker.getTypeOfSymbolAtLocation(
      prop,
      propsObj.valueDeclaration,
    );
    var propTypeString = checker.typeToString(propType);
    console.log(" " + propName + ": " + propTypeString);
  });
  console.log();
}
var e_1, _b, e_5, _h, e_4, _g, e_2, _e, e_3, _f;
