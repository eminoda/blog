declare module "nonce-str" {
  function nonce(bit: number): string;
  export = nonce;
}

enum ParseStatus {
  INIT = 0,
  PARSING = 1,
  DONE = 2,
  ERROR = -1,
}
interface ImageParse {
  id: string;
  src: string;
  status: ParseStatus;
  contentMD5?: string;
  blob: Blob;
  priviewUrl?: string;
}
