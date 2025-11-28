export interface StampConfig {
  mainText: string;
  subText: string;
  date: string;
  color: string;
  width: number;
  height: number;
  rotation: number;
  roughness: number;
  showBorder: boolean;
  showInnerBorder: boolean;
  showDots: boolean;
}

export const PRESETS = [
  { name: 'Approved', text: 'APPROVED', color: '#DC2626' },
  { name: 'Rejected', text: 'REJECTED', color: '#000000' },
  { name: 'Confidential', text: 'CONFIDENTIAL', color: '#4F46E5' },
  { name: 'Paid', text: 'PAID', color: '#16A34A' },
  { name: 'Urgent', text: 'URGENT', color: '#DC2626' },
];