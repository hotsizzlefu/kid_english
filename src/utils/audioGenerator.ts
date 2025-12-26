// 生成更可爱的音效数据
// 采样率
const SAMPLE_RATE = 44100;

// 基础波形函数
const sine = (t: number, freq: number) => Math.sin(2 * Math.PI * freq * t);
const triangle = (t: number, freq: number) => Math.asin(Math.sin(2 * Math.PI * freq * t)) * (2 / Math.PI);
const square = (t: number, freq: number) => Math.sign(Math.sin(2 * Math.PI * freq * t));
const sawtooth = (t: number, freq: number) => 2 * (t * freq - Math.floor(t * freq + 0.5));

// ADSR 包络
const envelope = (t: number, duration: number, attack: number, decay: number) => {
  if (t < attack) return t / attack;
  if (t < attack + decay) return 1 - (t - attack) / decay * 0.5; // 衰减到 0.5
  return Math.max(0, 0.5 * (1 - (t - attack - decay) / (duration - attack - decay)));
};

// 生成音频 buffer
const createBuffer = (duration: number) => {
  return new Float32Array(Math.floor(SAMPLE_RATE * duration));
};

// 叠加声音
const addTone = (buffer: Float32Array, startTime: number, freq: number, duration: number, vol: number = 0.5, type: 'sine' | 'triangle' | 'square' | 'sawtooth' = 'sine') => {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  
  for (let i = 0; i < totalSamples; i++) {
    const idx = startSample + i;
    if (idx >= buffer.length) break;
    
    const t = i / SAMPLE_RATE;
    let wave = 0;
    
    switch (type) {
      case 'sine': wave = sine(t, freq); break;
      case 'triangle': wave = triangle(t, freq); break;
      case 'square': wave = square(t, freq); break;
      case 'sawtooth': wave = sawtooth(t, freq); break;
    }
    
    const env = envelope(t, duration, 0.05, 0.1);
    buffer[idx] += wave * env * vol;
  }
};

// 1. 正确音效：清脆的上行琶音 (C6-E6-G6)
export const generateCorrectSound = (): string => {
  const duration = 0.6;
  const buffer = createBuffer(duration);
  
  // C6 (1046.5Hz), E6 (1318.5Hz), G6 (1568.0Hz)
  addTone(buffer, 0.0, 1046.5, 0.4, 0.3, 'triangle');
  addTone(buffer, 0.1, 1318.5, 0.4, 0.3, 'triangle');
  addTone(buffer, 0.2, 1568.0, 0.4, 0.3, 'triangle');
  
  return float32ArrayToBase64(buffer);
};

// 2. 错误音效：可爱的"Uh-oh" (E5 -> C#5) 下行
export const generateIncorrectSound = (): string => {
  const duration = 0.5;
  const buffer = createBuffer(duration);
  
  // E5 (659.3Hz) -> C#5 (554.4Hz)
  addTone(buffer, 0.0, 659.3, 0.3, 0.3, 'sine');
  setTimeout(() => {}, 0); // Mock
  addTone(buffer, 0.15, 554.4, 0.35, 0.3, 'sine');
  
  return float32ArrayToBase64(buffer);
};

// 3. 点击音效：清脆的木鱼声/气泡声
export const generateClickSound = (): string => {
  const duration = 0.1;
  const buffer = createBuffer(duration);
  
  const totalSamples = buffer.length;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    // 快速扫频 sine (800Hz -> 1200Hz)
    const freq = 800 + t * 4000;
    buffer[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 50) * 0.2;
  }
  
  return float32ArrayToBase64(buffer);
};

// 4. 背景音乐：活泼的卡通片风格旋律 (C大调，跳跃感)
export const generateBackgroundMusic = (): string => {
  // 节奏更快的卡通旋律
  // C5 E5 G5 E5 C5 E5 G5 -> C Major Arpeggio
  const notes = [
    // 第一小节：跳跃的 C 和弦
    { f: 523.25, d: 0.2, t: 0.0, type: 'square' }, // C5
    { f: 659.25, d: 0.2, t: 0.2, type: 'square' }, // E5
    { f: 783.99, d: 0.2, t: 0.4, type: 'square' }, // G5
    { f: 659.25, d: 0.2, t: 0.6, type: 'square' }, // E5
    
    // 第二小节：重复但加花
    { f: 523.25, d: 0.2, t: 0.8, type: 'square' }, // C5
    { f: 659.25, d: 0.2, t: 1.0, type: 'square' }, // E5
    { f: 783.99, d: 0.4, t: 1.2, type: 'square' }, // G5
    
    // 第三小节：F 和弦 (F5 A5 C6)
    { f: 698.46, d: 0.2, t: 1.6, type: 'square' }, // F5
    { f: 880.00, d: 0.2, t: 1.8, type: 'square' }, // A5
    { f: 1046.5, d: 0.2, t: 2.0, type: 'square' }, // C6
    { f: 880.00, d: 0.2, t: 2.2, type: 'square' }, // A5
    
    // 第四小节：G 和弦回到 C (G5 B5 D6 -> C6)
    { f: 783.99, d: 0.2, t: 2.4, type: 'square' }, // G5
    { f: 987.77, d: 0.2, t: 2.6, type: 'square' }, // B5
    { f: 1046.5, d: 0.6, t: 2.8, type: 'square' }, // C6 (结束音)
  ];
  
  // 添加贝斯线 (Bass Line) 增加节奏感
  const bassNotes = [
    { f: 261.63, d: 0.4, t: 0.0, type: 'triangle' }, // C4
    { f: 392.00, d: 0.4, t: 0.4, type: 'triangle' }, // G4
    { f: 261.63, d: 0.4, t: 0.8, type: 'triangle' }, // C4
    { f: 392.00, d: 0.4, t: 1.2, type: 'triangle' }, // G4
    
    { f: 349.23, d: 0.4, t: 1.6, type: 'triangle' }, // F4
    { f: 440.00, d: 0.4, t: 2.0, type: 'triangle' }, // A4
    { f: 392.00, d: 0.4, t: 2.4, type: 'triangle' }, // G4
    { f: 261.63, d: 0.8, t: 2.8, type: 'triangle' }, // C4
  ];
  
  const totalDuration = 3.4; // 循环长度
  const buffer = createBuffer(totalDuration);
  
  // 混合主旋律
  notes.forEach(note => {
    addTone(buffer, note.t, note.f, note.d, 0.1, note.type as any);
  });

  // 混合贝斯
  bassNotes.forEach(note => {
    addTone(buffer, note.t, note.f, note.d, 0.15, note.type as any);
  });
  
  return float32ArrayToBase64(buffer);
};

// 工具函数：将Float32Array转换为Base64编码的WAV数据
function float32ArrayToBase64(float32Array: Float32Array): string {
  const length = float32Array.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV文件头
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // 转换音频数据
  let offset = 44;
  for (let i = 0; i < length; i++) {
    // 简单的限幅，防止爆音
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    // 转换为 16-bit PCM
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }
  
  // 转换为Base64
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  // 使用分块处理避免栈溢出（如果数据非常大）
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, Math.min(i + chunkSize, bytes.length))));
  }
  
  return 'data:audio/wav;base64,' + btoa(binary);
}
