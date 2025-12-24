import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { HistoryItem } from '../types/history';
import { formatHistoryTime, formatDuration } from '../utils/history';
import { useTranslation } from '../lib/i18n-context';

interface HistoryItemCardProps {
  item: HistoryItem;
}

export function HistoryItemCard({ item }: HistoryItemCardProps) {
  const t = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4 space-y-3">
        {/* Summary Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {item.taskText}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{formatHistoryTime(item.startTime)}</span>
              <span>•</span>
              <span>
                {item.steps} {item.steps === 1 ? 'step' : 'steps'}
              </span>
              <span>•</span>
              <span>{formatDuration(item.duration)}</span>
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant={item.success ? 'success' : 'destructive'}>
            {item.success ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {t.history.success}
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                {t.history.failed}
              </>
            )}
          </Badge>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            {/* Thinking steps */}
            {item.thinking.map((think, idx) => (
              <div
                key={idx}
                className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3 h-3 text-[#1d9bf0]" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t.history.step.replace('{number}', (idx + 1).toString())}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {think}
                </p>

                {/* Action details */}
                {item.actions[idx] && (
                  <details className="mt-2">
                    <summary className="text-xs text-[#1d9bf0] cursor-pointer hover:underline">
                      {t.history.viewAction}
                    </summary>
                    <pre className="mt-1 text-[10px] bg-slate-900 text-slate-200 rounded p-2 overflow-x-auto">
                      {JSON.stringify(item.actions[idx], null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}

            {/* Final message */}
            <div
              className={`rounded-lg p-3 ${
                item.success
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
              }`}
            >
              <p className="text-xs font-medium mb-1">{t.history.finalResult}</p>
              <p className="text-xs">{item.finalMessage}</p>
            </div>
          </div>
        )}

        {/* Expand indicator */}
        <div className="flex items-center justify-center pt-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
    </Card>
  );
}
