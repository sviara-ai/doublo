export interface Colors {
  brandBlue: string;
  brandNavy: string;
  brandInk: string;
  background: string;
  surface: string;
  board: string;
  boardCell: string;
  primary: string;
  primaryPressed: string;
  text: string;
  textMuted: string;
  textInverse: string;
  cardNavy: string;
  overlay: string;
  hairline: string;
}

export const lightColors: Colors = {
  brandBlue: '#0060C7',
  brandNavy: '#101A86',
  brandInk: '#00163F',
  background: '#F3F7FE',
  surface: '#FFFFFF',
  board: '#CBDAF2',
  boardCell: '#E4EDFB',
  primary: '#0060C7',
  primaryPressed: '#0852A8',
  text: '#00163F',
  textMuted: '#5B6B8C',
  textInverse: '#FFFFFF',
  cardNavy: '#101A86',
  overlay: 'rgba(243, 247, 254, 0.93)',
  hairline: '#D4E0F4',
};

export const darkColors: Colors = {
  brandBlue: '#0060C7',
  brandNavy: '#101A86',
  brandInk: '#00163F',
  background: '#0A1124',
  surface: '#121C36',
  board: '#18243F',
  boardCell: '#243352',
  primary: '#3B82E8',
  primaryPressed: '#2C66BE',
  text: '#EAF1FC',
  textMuted: '#9AA8C8',
  textInverse: '#FFFFFF',
  cardNavy: '#1E2C6E',
  overlay: 'rgba(10, 17, 36, 0.92)',
  hairline: '#2A3756',
};
