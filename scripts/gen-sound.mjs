import { mkdirSync, writeFileSync } from 'node:fs';

const rate = 44100;
const duration = 0.045;
const sampleCount = Math.floor(rate * duration);
const buffer = Buffer.alloc(44 + sampleCount * 2);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + sampleCount * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(rate, 24);
buffer.writeUInt32LE(rate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(sampleCount * 2, 40);

for (let i = 0; i < sampleCount; i += 1) {
  const t = i / rate;
  const envelope = Math.exp(-t * 90);
  const tone = Math.sin(2 * Math.PI * 1050 * t);
  const value = Math.sign(tone) * envelope * 0.4;
  const clamped = Math.max(-1, Math.min(1, value));
  buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
}

mkdirSync('assets/sounds', { recursive: true });
writeFileSync('assets/sounds/merge.wav', buffer);
console.log('wrote assets/sounds/merge.wav', buffer.length, 'bytes');
