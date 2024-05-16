import { describe, expect, it } from "vitest"
import { stringifyWindowFeatures } from "../windowFeatures"

describe("stringifyWindowFeatures", () => {
  // prettier-ignore
  it("works", () => {
    expect(stringifyWindowFeatures({})).toBe("");
    expect(stringifyWindowFeatures({ popup: false })).toBe("");
    expect(stringifyWindowFeatures({ popup: true })).toBe("popup");
    expect(stringifyWindowFeatures({ popup: true, width: 0 })).toBe("popup,width=0");
    expect(stringifyWindowFeatures({ popup: true, width: 50 })).toBe("popup,width=50");
    expect(stringifyWindowFeatures({ popup: false, width: 50, height: 60 })).toBe("width=50,height=60");
    expect(stringifyWindowFeatures({ popup: undefined, width: 50, height: 60 })).toBe("width=50,height=60");
    expect(stringifyWindowFeatures({ popup: undefined, width: undefined, height: 60 })).toBe("height=60");
  });
})
