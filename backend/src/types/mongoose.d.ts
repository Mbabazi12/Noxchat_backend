declare module 'mongoose' {
  const mongoose: any;
  export default mongoose;

  export type Document = any;

  // Minimal generic-friendly stubs so your existing mongoose models compile.
  export class Schema<T = any> {
    constructor(def?: any, opts?: any);
    static Types: any;
  }

  export type Model<T = any> = any;

  export namespace Types {
    // Used in code as a TYPE: `Types.ObjectId`
    export type ObjectId = any;
  }
}

