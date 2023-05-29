export interface IResponseImage {
  url: string;
}

export interface IRespone {
  images: Array<IResponseImage>;
}

export interface IinterrogateResponse {
  caption: string;
}

export interface IinterrogateRequest {
  image: string;
}

export interface IgetPromptRequest {
  year: string | number;
  clipPrompt: string;
}

export interface IgetPromptResponse {
  prompt: string;
}

export interface IconvertRequest {
  prompt: string;
  image: string;
}
