import { LocalSessionStats, ProcessingResult } from '../types';

const STATS_KEY = 'rtx_fury_personal_stats';
const HISTORY_KEY = 'rtx_fury_personal_history';

const INITIAL_BASE = {
  baseTotal: 73441,
  baseUsers: 31617,
  baseToday: 4559,
};

export function getLocalStats(): {
  displayTotal: number;
  displayUsers: number;
  displayToday: number;
  localCount: number;
  bytesProcessed: number;
} {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      return {
        displayTotal: INITIAL_BASE.baseTotal,
        displayUsers: INITIAL_BASE.baseUsers,
        displayToday: INITIAL_BASE.baseToday,
        localCount: 0,
        bytesProcessed: 0,
      };
    }
    const parsed: LocalSessionStats = JSON.parse(raw);
    return {
      displayTotal: INITIAL_BASE.baseTotal + (parsed.totalOptimizations || 0),
      displayUsers: INITIAL_BASE.baseUsers,
      displayToday: INITIAL_BASE.baseToday + (parsed.totalOptimizations || 0),
      localCount: parsed.totalOptimizations || 0,
      bytesProcessed: parsed.bytesProcessed || 0,
    };
  } catch {
    return {
      displayTotal: INITIAL_BASE.baseTotal,
      displayUsers: INITIAL_BASE.baseUsers,
      displayToday: INITIAL_BASE.baseToday,
      localCount: 0,
      bytesProcessed: 0,
    };
  }
}

export function recordOptimization(result: ProcessingResult): void {
  try {
    const current = getLocalStats();
    const updated: LocalSessionStats = {
      totalOptimizations: current.localCount + 1,
      filesOptimized: current.localCount + 1,
      bytesProcessed: current.bytesProcessed + result.originalSize,
      lastOptimizedAt: new Date().toISOString(),
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));

    // Also append to recent history
    const historyRaw = localStorage.getItem(HISTORY_KEY);
    const history: ProcessingResult[] = historyRaw ? JSON.parse(historyRaw) : [];
    // Keep last 10 entries (without blobUrl to save space, keeping metadata)
    const entry = {
      ...result,
      blobUrl: '', // omit blob url in storage
    };
    history.unshift(entry as ProcessingResult);
    if (history.length > 10) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save local stats', e);
  }
}

export function getOptimizationHistory(): Partial<ProcessingResult>[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
