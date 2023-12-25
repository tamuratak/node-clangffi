import { lib } from "../lib";
import { Cursor } from "./cursor";
import type { CXTranslationUnit, INativeHandle } from "./types";

export class TranslationUnit implements INativeHandle<CXTranslationUnit> {
  constructor(private ptr: CXTranslationUnit) {}

  get handle(): CXTranslationUnit {
    return this.ptr;
  }

  get cursor(): Cursor {
    return new Cursor(lib.clang_getTranslationUnitCursor(this.ptr));
  }
}
