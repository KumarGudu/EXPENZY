'use client';

import { Button } from '@/components/ui/button';
import { TrendingUp, Download, HandCoins } from 'lucide-react';

interface SettleUpBarProps {
    onSettleUp: () => void;
    onViewStatistics: () => void;
    onExport: () => void;
    isMobile?: boolean;
}

export function SettleUpBar({
    onSettleUp,
    onViewStatistics,
    onExport,
    isMobile = false,
}: SettleUpBarProps) {
    if (isMobile) {
        return (
            <div className="fixed bottom-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border px-4 py-3">
                <div className="flex gap-2">
                    <Button
                        onClick={onSettleUp}
                        className="flex-1"
                        size="lg"
                    >
                        <HandCoins className="h-5 w-5 mr-2" />
                        Settle Up
                    </Button>
                    <Button
                        onClick={onViewStatistics}
                        variant="outline"
                        size="lg"
                    >
                        <TrendingUp className="h-5 w-5" />
                    </Button>
                    <Button
                        onClick={onExport}
                        variant="outline"
                        size="lg"
                    >
                        <Download className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-3 mb-6">
            <Button onClick={onSettleUp} size="lg">
                <HandCoins className="h-5 w-5 mr-2" />
                Settle Up
            </Button>
            <Button onClick={onViewStatistics} variant="outline" size="lg">
                <TrendingUp className="h-5 w-5 mr-2" />
                Statistics
            </Button>
            <Button onClick={onExport} variant="outline" size="lg">
                <Download className="h-5 w-5 mr-2" />
                Export
            </Button>
        </div>
    );
}
