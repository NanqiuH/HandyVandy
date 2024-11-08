import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;