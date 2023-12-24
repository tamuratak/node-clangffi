import {
    loadLibClang,
    createIndex,
    parse,
    visit,
    Language,
    CXChildVisitResult,
    Decl,
    FunctionDecl,
  } from "./dist/index.js";
  
  // using a non-qualified path for the lib will search for the binary in `PATH`.
  const defaultLibPath = '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/libclang.dylib'
  
  // load the library first
  loadLibClang(defaultLibPath);
  
  // create an index (storage for symbols)
  const cxIndex = createIndex();
  
  // parse a header into a translation unit
  // using the given language and additional include directories
  const translationUnit = parse({
    path: "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/include/limits.h",
    language: Language.Cpp,
    index: cxIndex,
    includeDirectories: ["/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/include/"],
  });
  
  // walk the translationUnit AST
  visit(translationUnit, (current, parent, userData) => {
    // see if the cursor is a decl
    const maybeDecl = Decl.CreateTypedDecl(current, parent);
  
    // if it came back as a typed decl, perhaps we're more interested in it
    if (maybeDecl) {
      // for example, we can check if it's a function decl
      if (maybeDecl instanceof FunctionDecl) {
        const fnDecl = maybeDecl // as FunctionDecl;
        // and if it is, choose to log it's name and return type
        console.log(
          `${fnDecl.name} returns ${fnDecl.typeClass.returnType?.name}`
        );
      }
  
      // there are many other subclasses of `Decl` too
      // see `Decl.CreateTypedDecl` for more info
    }
  
    // continue to walk the ast
    return CXChildVisitResult.CXChildVisit_Continue;
  });