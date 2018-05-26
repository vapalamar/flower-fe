/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare function unescape(s: string): string;
declare function escape(s: string): string;
