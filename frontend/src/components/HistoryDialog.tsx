import React, { useEffect, useState } from 'react';
import { History, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HistoryGroup } from './HistoryGroup';
import {
  loadHistoryItems,
  clearHistory,
  groupHistoryByDate,
} from '../utils/history';
import { useTranslation } from '../lib/i18n-context';

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
  deviceName: string;
}

export function HistoryDialog({
  open,
  onOpenChange,
  deviceId,
  deviceName,
}: HistoryDialogProps) {
  const t = useTranslation();
  const [historyItems, setHistoryItems] = useState<ReturnType<
    typeof loadHistoryItems
  > | null>(null);

  // 当对话框打开时加载历史记录
  useEffect(() => {
    if (open && deviceId) {
      const items = loadHistoryItems(deviceId);
      setHistoryItems(items);
    }
  }, [open, deviceId]);

  const handleClearAll = () => {
    if (confirm(t.history.clearAllConfirm)) {
      clearHistory(deviceId);
      setHistoryItems([]);
    }
  };

  if (!historyItems) {
    return null;
  }

  const grouped = groupHistoryByDate(historyItems);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#1d9bf0]" />
            {t.history.title}
          </DialogTitle>
          <DialogDescription>
            {t.history.description.replace('{deviceName}', deviceName)}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable history list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
          {grouped.today.length > 0 && (
            <HistoryGroup title={t.history.today} items={grouped.today} />
          )}
          {grouped.yesterday.length > 0 && (
            <HistoryGroup
              title={t.history.yesterday}
              items={grouped.yesterday}
            />
          )}
          {grouped.earlier.length > 0 && (
            <HistoryGroup title={t.history.earlier} items={grouped.earlier} />
          )}

          {/* Empty state */}
          {historyItems.length === 0 && (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4">
                <History className="h-8 w-8 text-slate-400" />
              </div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {t.history.noHistory}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.history.noHistoryDescription}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {historyItems.length > 0 && (
            <Button variant="outline" onClick={handleClearAll}>
              <Trash className="w-4 h-4 mr-2" />
              {t.history.clearAll}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
