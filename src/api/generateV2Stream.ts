import type { APISettings, v2ApiOptions } from '../index';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const CONNECTION_TIMEOUT = 30 * 1000; // 30s
const INNACTIVITY_TIMEOUT = 20 * 1000; // 20s

export type V2SpeechResult = {
  id: string;
  url: string;
  duration: number;
  size: number;
};

export default async function generateV2Stream(
  settings: APISettings,
  text: string,
  voice: string,
  outputStream: NodeJS.WritableStream,
  options?: v2ApiOptions,
): Promise<void> {
  const { apiKey, userId } = settings;
  const streamOptions: AxiosRequestConfig = {
    method: 'POST',
    url: 'https://play.ht/api/v2/tts/stream',
    headers: {
      accept: 'audio/mpeg',
      'content-type': 'application/json',
      AUTHORIZATION: apiKey,
      'X-USER-ID': userId,
    },
    responseType: 'stream',
    data: {
      text,
      voice,
      quality: options?.quality || 'medium',
      output_format: options?.outputFormat || 'mp3',
      speed: options?.speed || 1,
      sample_rate: options?.sampleRate || 24000,
      seed: options?.seed,
      temperature: options?.temperature,
    },
  };

  const response = await axios(streamOptions).catch((error: any) => {
    throw new Error(error);
  });

  response.data.pipe(outputStream);
}
