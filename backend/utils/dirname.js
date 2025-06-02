import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);  // Trả về URL của file hiện tại (VD: 'file:///C:/project/server.js')
const __dirname = path.dirname(__filename); // Biến URL đó thành đường dẫn thật (C:/project/server.js)

export const baseProject = path.resolve(__dirname, '..')