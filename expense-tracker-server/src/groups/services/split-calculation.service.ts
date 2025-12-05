import { Injectable, BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

export interface SplitParticipant {
    userId: string;
    amount?: number; // For exact splits
    percentage?: number; // For percentage splits
}

export interface CalculatedSplit {
    userId: string;
    amountOwed: number;
    percentage?: number;
    calculatedAmount: number;
    adjustmentAmount: number;
    isRoundingAdjustment: boolean;
}

export interface SplitValidationResult {
    isValid: boolean;
    status: 'valid' | 'sum_mismatch' | 'percentage_mismatch' | 'invalid_participants';
    message?: string;
    difference?: number;
}

@Injectable()
export class SplitCalculationService {
    private readonly TOLERANCE = 0.01; // ₹0.01 tolerance for rounding

    /**
     * Calculate equal splits among participants
     * Handles rounding by assigning remainder to payer
     */
    calculateEqualSplit(
        totalAmount: number,
        participants: SplitParticipant[],
        payerId: string,
    ): CalculatedSplit[] {
        if (participants.length === 0) {
            throw new BadRequestException('At least one participant is required');
        }

        if (totalAmount <= 0) {
            throw new BadRequestException('Amount must be greater than 0');
        }

        const participantCount = participants.length;
        const baseAmount = Math.floor((totalAmount * 100) / participantCount) / 100; // Round down to 2 decimals
        const remainder = Math.round((totalAmount - baseAmount * participantCount) * 100) / 100;

        const splits: CalculatedSplit[] = participants.map((participant, index) => {
            // Assign remainder to payer
            const isPayerAndLastParticipant = participant.userId === payerId && index === participantCount - 1;
            const adjustment = isPayerAndLastParticipant ? remainder : 0;
            const finalAmount = baseAmount + adjustment;

            return {
                userId: participant.userId,
                amountOwed: finalAmount,
                percentage: Math.round((finalAmount / totalAmount) * 10000) / 100, // Calculate percentage
                calculatedAmount: baseAmount,
                adjustmentAmount: adjustment,
                isRoundingAdjustment: adjustment !== 0,
            };
        });

        // If payer is not in participants, assign remainder to first participant
        if (!participants.some(p => p.userId === payerId) && remainder !== 0) {
            splits[0].amountOwed += remainder;
            splits[0].adjustmentAmount = remainder;
            splits[0].isRoundingAdjustment = true;
        }

        return splits;
    }

    /**
     * Calculate exact/unequal splits
     * Validates that sum matches total amount
     */
    calculateExactSplit(
        totalAmount: number,
        participants: SplitParticipant[],
    ): CalculatedSplit[] {
        if (participants.length === 0) {
            throw new BadRequestException('At least one participant is required');
        }

        if (participants.some(p => !p.amount || p.amount <= 0)) {
            throw new BadRequestException('All participants must have a valid amount');
        }

        const sum = participants.reduce((acc, p) => acc + (p.amount || 0), 0);
        const difference = Math.abs(sum - totalAmount);

        if (difference > this.TOLERANCE) {
            throw new BadRequestException(
                `Split amounts don't add up to total. Difference: ₹${difference.toFixed(2)}`,
            );
        }

        return participants.map(participant => ({
            userId: participant.userId,
            amountOwed: participant.amount!,
            percentage: Math.round((participant.amount! / totalAmount) * 10000) / 100,
            calculatedAmount: participant.amount!,
            adjustmentAmount: 0,
            isRoundingAdjustment: false,
        }));
    }

    /**
     * Calculate percentage-based splits
     * Validates that percentages sum to 100%
     */
    calculatePercentageSplit(
        totalAmount: number,
        participants: SplitParticipant[],
        payerId: string,
    ): CalculatedSplit[] {
        if (participants.length === 0) {
            throw new BadRequestException('At least one participant is required');
        }

        if (participants.some(p => !p.percentage || p.percentage <= 0 || p.percentage > 100)) {
            throw new BadRequestException('All participants must have a valid percentage (0-100)');
        }

        const totalPercentage = participants.reduce((acc, p) => acc + (p.percentage || 0), 0);
        const percentageDifference = Math.abs(totalPercentage - 100);

        if (percentageDifference > this.TOLERANCE) {
            throw new BadRequestException(
                `Percentages must sum to 100%. Current sum: ${totalPercentage.toFixed(2)}%`,
            );
        }

        // Calculate amounts from percentages
        const splits: CalculatedSplit[] = participants.map(participant => {
            const calculatedAmount = Math.round((totalAmount * participant.percentage!) / 100 * 100) / 100;
            return {
                userId: participant.userId,
                amountOwed: calculatedAmount,
                percentage: participant.percentage!,
                calculatedAmount,
                adjustmentAmount: 0,
                isRoundingAdjustment: false,
            };
        });

        // Handle rounding difference
        const totalCalculated = splits.reduce((acc, s) => acc + s.amountOwed, 0);
        const roundingDifference = Math.round((totalAmount - totalCalculated) * 100) / 100;

        if (Math.abs(roundingDifference) > 0) {
            // Assign rounding difference to payer if they're a participant
            const payerSplit = splits.find(s => s.userId === payerId);
            if (payerSplit) {
                payerSplit.amountOwed += roundingDifference;
                payerSplit.adjustmentAmount = roundingDifference;
                payerSplit.isRoundingAdjustment = true;
            } else {
                // Otherwise assign to first participant
                splits[0].amountOwed += roundingDifference;
                splits[0].adjustmentAmount = roundingDifference;
                splits[0].isRoundingAdjustment = true;
            }
        }

        return splits;
    }

    /**
     * Main calculation method that routes to appropriate split type
     */
    calculateSplits(
        totalAmount: number,
        splitType: 'equal' | 'exact' | 'percentage',
        participants: SplitParticipant[],
        payerId: string,
    ): CalculatedSplit[] {
        switch (splitType) {
            case 'equal':
                return this.calculateEqualSplit(totalAmount, participants, payerId);
            case 'exact':
                return this.calculateExactSplit(totalAmount, participants);
            case 'percentage':
                return this.calculatePercentageSplit(totalAmount, participants, payerId);
            default:
                throw new BadRequestException(`Invalid split type: ${splitType}`);
        }
    }

    /**
     * Validate calculated splits
     */
    validateSplits(
        totalAmount: number,
        splits: CalculatedSplit[],
    ): SplitValidationResult {
        if (splits.length === 0) {
            return {
                isValid: false,
                status: 'invalid_participants',
                message: 'No participants in split',
            };
        }

        const sum = splits.reduce((acc, s) => acc + s.amountOwed, 0);
        const difference = Math.abs(sum - totalAmount);

        if (difference > this.TOLERANCE) {
            return {
                isValid: false,
                status: 'sum_mismatch',
                message: `Split amounts don't match total. Difference: ₹${difference.toFixed(2)}`,
                difference,
            };
        }

        return {
            isValid: true,
            status: 'valid',
        };
    }

    /**
     * Calculate rounding difference for metadata
     */
    calculateRoundingDifference(
        totalAmount: number,
        splits: CalculatedSplit[],
    ): number {
        const sum = splits.reduce((acc, s) => acc + s.amountOwed, 0);
        return Math.round((totalAmount - sum) * 10000) / 10000; // 4 decimal precision
    }
}
