import 'fabric';

declare module 'fabric' {
  interface Object {
    id?: string;
  }

  interface IObjectOptions {
    id?: string;
  }
}