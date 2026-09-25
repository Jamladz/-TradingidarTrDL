export type SignalStatus = 'ACTIVE' | 'TP1 HIT' | 'TP2 HIT' | 'TP3 HIT' | 'TP4 HIT' | 'SL HIT' | 'CLOSED';
export type SignalDirection = 'BUY' | 'SELL';

export interface Signal {
  id: string;
  direction: SignalDirection;
  symbol: string;
  openFrom: number;
  openTo: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  status: SignalStatus;
  published: boolean;
  createdAt: any;
  updatedAt: any;
  signalDate: string;
  signalTime: string;
  createdBy: string;
}
