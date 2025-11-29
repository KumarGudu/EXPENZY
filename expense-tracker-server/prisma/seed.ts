import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Cleaning existing data...');
    await prisma.loanPayment.deleteMany();
    await prisma.loan.deleteMany();
    await prisma.splitParticipant.deleteMany();
    await prisma.splitExpense.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.recurringPattern.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.monthlySummary.deleteMany();
    await prisma.yearlySummary.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.exchangeRate.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
        data: {
            email: 'john.doe@example.com',
            username: 'johndoe',
            passwordHash: hashedPassword,
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            defaultCurrency: 'USD',
            timezone: 'America/New_York',
            isActive: true,
            isVerified: true,
            lastLoginAt: new Date(),
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'jane.smith@example.com',
            username: 'janesmith',
            passwordHash: hashedPassword,
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '+1234567891',
            defaultCurrency: 'USD',
            timezone: 'America/Los_Angeles',
            isActive: true,
            isVerified: true,
            lastLoginAt: new Date(),
        },
    });

    const user3 = await prisma.user.create({
        data: {
            email: 'bob.wilson@example.com',
            username: 'bobwilson',
            googleId: 'google_123456789',
            firstName: 'Bob',
            lastName: 'Wilson',
            defaultCurrency: 'EUR',
            timezone: 'Europe/London',
            isActive: true,
            isVerified: true,
            lastLoginAt: new Date(),
        },
    });

    console.log(`✅ Created ${3} users`);

    // Create System Categories
    console.log('📁 Creating categories...');
    const systemCategories = [
        { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', type: 'expense' },
        { name: 'Transportation', icon: '🚗', color: '#4ECDC4', type: 'expense' },
        { name: 'Shopping', icon: '🛍️', color: '#95E1D3', type: 'expense' },
        { name: 'Entertainment', icon: '🎬', color: '#F38181', type: 'expense' },
        { name: 'Bills & Utilities', icon: '💡', color: '#AA96DA', type: 'expense' },
        { name: 'Healthcare', icon: '🏥', color: '#FCBAD3', type: 'expense' },
        { name: 'Education', icon: '📚', color: '#A8D8EA', type: 'expense' },
        { name: 'Travel', icon: '✈️', color: '#FFD93D', type: 'expense' },
        { name: 'Salary', icon: '💰', color: '#6BCF7F', type: 'income' },
        { name: 'Freelance', icon: '💼', color: '#4D96FF', type: 'income' },
    ];

    const createdSystemCategories = await Promise.all(
        systemCategories.map((cat) =>
            prisma.category.create({
                data: {
                    ...cat,
                    isSystem: true,
                },
            }),
        ),
    );

    // Create User-specific Categories
    const userCategories = await Promise.all([
        prisma.category.create({
            data: {
                userId: user1.id,
                name: 'Gym Membership',
                icon: '💪',
                color: '#FF5722',
                type: 'expense',
                isSystem: false,
            },
        }),
        prisma.category.create({
            data: {
                userId: user1.id,
                name: 'Pet Care',
                icon: '🐕',
                color: '#8BC34A',
                type: 'expense',
                isSystem: false,
            },
        }),
        prisma.category.create({
            data: {
                userId: user2.id,
                name: 'Online Courses',
                icon: '💻',
                color: '#2196F3',
                type: 'expense',
                isSystem: false,
            },
        }),
    ]);

    console.log(
        `✅ Created ${createdSystemCategories.length + userCategories.length} categories`,
    );

    // Create Recurring Patterns
    console.log('🔄 Creating recurring patterns...');
    const recurringPattern1 = await prisma.recurringPattern.create({
        data: {
            userId: user1.id,
            frequency: 'monthly',
            interval: 1,
            dayOfMonth: 1,
            startDate: new Date('2024-01-01'),
            nextOccurrence: new Date('2025-01-01'),
            isActive: true,
        },
    });

    const recurringPattern2 = await prisma.recurringPattern.create({
        data: {
            userId: user1.id,
            frequency: 'weekly',
            interval: 1,
            dayOfWeek: 1,
            startDate: new Date('2024-01-01'),
            nextOccurrence: new Date('2024-12-30'),
            isActive: true,
        },
    });

    console.log(`✅ Created ${2} recurring patterns`);

    // Create Expenses
    console.log('💸 Creating expenses...');
    const expenses = await Promise.all([
        // User 1 expenses
        prisma.expense.create({
            data: {
                userId: user1.id,
                categoryId: createdSystemCategories[0].id, // Food & Dining
                amount: 45.5,
                currency: 'USD',
                description: 'Lunch at Italian Restaurant',
                expenseDate: new Date('2024-11-25'),
                paymentMethod: 'credit_card',
                tags: ['restaurant', 'italian'],
                notes: 'Team lunch',
            },
        }),
        prisma.expense.create({
            data: {
                userId: user1.id,
                categoryId: createdSystemCategories[1].id, // Transportation
                amount: 25.0,
                currency: 'USD',
                description: 'Uber to office',
                expenseDate: new Date('2024-11-26'),
                paymentMethod: 'debit_card',
                tags: ['uber', 'commute'],
            },
        }),
        prisma.expense.create({
            data: {
                userId: user1.id,
                categoryId: createdSystemCategories[4].id, // Bills & Utilities
                amount: 120.0,
                currency: 'USD',
                description: 'Monthly electricity bill',
                expenseDate: new Date('2024-11-01'),
                paymentMethod: 'bank_transfer',
                isRecurring: true,
                recurringPatternId: recurringPattern1.id,
                tags: ['utility', 'electricity'],
            },
        }),
        prisma.expense.create({
            data: {
                userId: user1.id,
                categoryId: userCategories[0].id, // Gym Membership
                amount: 50.0,
                currency: 'USD',
                description: 'Monthly gym membership',
                expenseDate: new Date('2024-11-01'),
                paymentMethod: 'credit_card',
                isRecurring: true,
                recurringPatternId: recurringPattern1.id,
                tags: ['fitness', 'health'],
            },
        }),
        // User 2 expenses
        prisma.expense.create({
            data: {
                userId: user2.id,
                categoryId: createdSystemCategories[2].id, // Shopping
                amount: 89.99,
                currency: 'USD',
                description: 'New running shoes',
                expenseDate: new Date('2024-11-20'),
                paymentMethod: 'credit_card',
                tags: ['shopping', 'sports'],
            },
        }),
        prisma.expense.create({
            data: {
                userId: user2.id,
                categoryId: createdSystemCategories[3].id, // Entertainment
                amount: 15.0,
                currency: 'USD',
                description: 'Netflix subscription',
                expenseDate: new Date('2024-11-01'),
                paymentMethod: 'credit_card',
                tags: ['streaming', 'entertainment'],
            },
        }),
        // User 3 expenses
        prisma.expense.create({
            data: {
                userId: user3.id,
                categoryId: createdSystemCategories[7].id, // Travel
                amount: 450.0,
                currency: 'EUR',
                description: 'Flight to Paris',
                expenseDate: new Date('2024-11-15'),
                paymentMethod: 'credit_card',
                tags: ['travel', 'flight'],
            },
        }),
    ]);

    console.log(`✅ Created ${expenses.length} expenses`);

    // Create Split Expenses
    console.log('💰 Creating split expenses...');
    const splitExpense1 = await prisma.splitExpense.create({
        data: {
            expenseId: expenses[0].id,
            totalAmount: 120.0,
            currency: 'USD',
            splitType: 'equal',
            paidByUserId: user1.id,
            description: 'Team lunch split',
        },
    });

    const splitExpense2 = await prisma.splitExpense.create({
        data: {
            expenseId: expenses[6].id,
            totalAmount: 300.0,
            currency: 'EUR',
            splitType: 'equal',
            paidByUserId: user3.id,
            description: 'Hotel booking in Paris',
        },
    });

    console.log(`✅ Created ${2} split expenses`);

    // Create Split Participants
    console.log('👥 Creating split participants...');
    await Promise.all([
        prisma.splitParticipant.create({
            data: {
                splitExpenseId: splitExpense1.id,
                userId: user1.id,
                amountOwed: 60.0,
                amountPaid: 120.0,
                isSettled: false,
            },
        }),
        prisma.splitParticipant.create({
            data: {
                splitExpenseId: splitExpense1.id,
                userId: user2.id,
                amountOwed: 60.0,
                amountPaid: 0,
                isSettled: false,
            },
        }),
        prisma.splitParticipant.create({
            data: {
                splitExpenseId: splitExpense2.id,
                userId: user3.id,
                amountOwed: 150.0,
                amountPaid: 300.0,
                isSettled: false,
            },
        }),
        prisma.splitParticipant.create({
            data: {
                splitExpenseId: splitExpense2.id,
                userId: user2.id,
                amountOwed: 150.0,
                amountPaid: 0,
                isSettled: false,
            },
        }),
    ]);

    console.log(`✅ Created ${4} split participants`);

    // Create Loans
    console.log('💵 Creating loans...');
    const loan1 = await prisma.loan.create({
        data: {
            lenderUserId: user1.id,
            borrowerUserId: user2.id,
            amount: 500.0,
            currency: 'USD',
            description: 'Emergency loan',
            loanDate: new Date('2024-11-01'),
            dueDate: new Date('2024-12-31'),
            status: 'active',
            amountPaid: 200.0,
            amountRemaining: 300.0,
            interestRate: 0,
        },
    });

    const loan2 = await prisma.loan.create({
        data: {
            lenderUserId: user3.id,
            borrowerUserId: user1.id,
            amount: 1000.0,
            currency: 'EUR',
            description: 'Car repair loan',
            loanDate: new Date('2024-10-15'),
            dueDate: new Date('2025-01-15'),
            status: 'active',
            amountPaid: 0,
            amountRemaining: 1000.0,
            interestRate: 2.5,
        },
    });

    console.log(`✅ Created ${2} loans`);

    // Create Loan Payments
    console.log('💳 Creating loan payments...');
    await Promise.all([
        prisma.loanPayment.create({
            data: {
                loanId: loan1.id,
                amount: 100.0,
                currency: 'USD',
                paymentDate: new Date('2024-11-10'),
                paymentMethod: 'bank_transfer',
                notes: 'First installment',
            },
        }),
        prisma.loanPayment.create({
            data: {
                loanId: loan1.id,
                amount: 100.0,
                currency: 'USD',
                paymentDate: new Date('2024-11-20'),
                paymentMethod: 'cash',
                notes: 'Second installment',
            },
        }),
    ]);

    console.log(`✅ Created ${2} loan payments`);

    // Create Budgets
    console.log('📊 Creating budgets...');
    await Promise.all([
        prisma.budget.create({
            data: {
                userId: user1.id,
                categoryId: createdSystemCategories[0].id, // Food & Dining
                amount: 500.0,
                currency: 'USD',
                periodType: 'monthly',
                startDate: new Date('2024-11-01'),
                endDate: new Date('2024-11-30'),
                spentAmount: 45.5,
                alertThreshold: 80.0,
                isActive: true,
            },
        }),
        prisma.budget.create({
            data: {
                userId: user1.id,
                categoryId: createdSystemCategories[1].id, // Transportation
                amount: 200.0,
                currency: 'USD',
                periodType: 'monthly',
                startDate: new Date('2024-11-01'),
                endDate: new Date('2024-11-30'),
                spentAmount: 25.0,
                alertThreshold: 75.0,
                isActive: true,
            },
        }),
        prisma.budget.create({
            data: {
                userId: user2.id,
                categoryId: createdSystemCategories[2].id, // Shopping
                amount: 300.0,
                currency: 'USD',
                periodType: 'monthly',
                startDate: new Date('2024-11-01'),
                endDate: new Date('2024-11-30'),
                spentAmount: 89.99,
                alertThreshold: 80.0,
                isActive: true,
            },
        }),
    ]);

    console.log(`✅ Created ${3} budgets`);

    // Create Monthly Summaries
    console.log('📈 Creating monthly summaries...');
    await Promise.all([
        prisma.monthlySummary.create({
            data: {
                userId: user1.id,
                year: 2024,
                month: 11,
                currency: 'USD',
                totalIncome: 5000.0,
                totalExpenses: 240.5,
                netSavings: 4759.5,
                expenseCount: 4,
                averageExpense: 60.13,
                largestExpense: 120.0,
                categoryBreakdown: {
                    'Food & Dining': 45.5,
                    Transportation: 25.0,
                    'Bills & Utilities': 120.0,
                    'Gym Membership': 50.0,
                },
            },
        }),
        prisma.monthlySummary.create({
            data: {
                userId: user2.id,
                year: 2024,
                month: 11,
                currency: 'USD',
                totalIncome: 4500.0,
                totalExpenses: 104.99,
                netSavings: 4395.01,
                expenseCount: 2,
                averageExpense: 52.5,
                largestExpense: 89.99,
                categoryBreakdown: {
                    Shopping: 89.99,
                    Entertainment: 15.0,
                },
            },
        }),
    ]);

    console.log(`✅ Created ${2} monthly summaries`);

    // Create Yearly Summaries
    console.log('📊 Creating yearly summaries...');
    await Promise.all([
        prisma.yearlySummary.create({
            data: {
                userId: user1.id,
                year: 2024,
                currency: 'USD',
                totalIncome: 60000.0,
                totalExpenses: 28500.0,
                netSavings: 31500.0,
                expenseCount: 145,
                averageMonthlyExpense: 2375.0,
                largestExpense: 1200.0,
                monthWithHighestExpense: 7,
                categoryBreakdown: {
                    'Food & Dining': 6500.0,
                    Transportation: 3200.0,
                    'Bills & Utilities': 8400.0,
                    Shopping: 4500.0,
                    Entertainment: 2400.0,
                    Healthcare: 1500.0,
                    'Gym Membership': 600.0,
                    Other: 1400.0,
                },
            },
        }),
    ]);

    console.log(`✅ Created ${1} yearly summary`);

    // Create Notifications
    console.log('🔔 Creating notifications...');
    await Promise.all([
        prisma.notification.create({
            data: {
                userId: user1.id,
                type: 'budget_alert',
                title: 'Budget Alert',
                message: 'You have reached 80% of your Food & Dining budget',
                relatedEntityType: 'budget',
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: user2.id,
                type: 'split_reminder',
                title: 'Payment Reminder',
                message: 'You owe $60 to John Doe for Team lunch',
                relatedEntityType: 'split_expense',
                isRead: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: user1.id,
                type: 'loan_reminder',
                title: 'Loan Payment Due',
                message: 'Loan payment of $300 is due on 2024-12-31',
                relatedEntityType: 'loan',
                isRead: true,
                readAt: new Date(),
            },
        }),
    ]);

    console.log(`✅ Created ${3} notifications`);

    // Create Audit Logs
    console.log('📝 Creating audit logs...');
    await Promise.all([
        prisma.auditLog.create({
            data: {
                userId: user1.id,
                entityType: 'expense',
                entityId: expenses[0].id,
                action: 'create',
                newValues: {
                    amount: 45.5,
                    description: 'Lunch at Italian Restaurant',
                },
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0',
            },
        }),
        prisma.auditLog.create({
            data: {
                userId: user1.id,
                entityType: 'budget',
                entityId: 'budget-1',
                action: 'update',
                oldValues: {
                    amount: 400.0,
                },
                newValues: {
                    amount: 500.0,
                },
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0',
            },
        }),
    ]);

    console.log(`✅ Created ${2} audit logs`);

    // Create Exchange Rates
    console.log('💱 Creating exchange rates...');
    await Promise.all([
        prisma.exchangeRate.create({
            data: {
                baseCurrency: 'USD',
                targetCurrency: 'EUR',
                rate: 0.92,
                rateDate: new Date('2024-11-29'),
                source: 'ECB',
            },
        }),
        prisma.exchangeRate.create({
            data: {
                baseCurrency: 'USD',
                targetCurrency: 'GBP',
                rate: 0.79,
                rateDate: new Date('2024-11-29'),
                source: 'ECB',
            },
        }),
        prisma.exchangeRate.create({
            data: {
                baseCurrency: 'EUR',
                targetCurrency: 'USD',
                rate: 1.09,
                rateDate: new Date('2024-11-29'),
                source: 'ECB',
            },
        }),
        prisma.exchangeRate.create({
            data: {
                baseCurrency: 'USD',
                targetCurrency: 'INR',
                rate: 83.5,
                rateDate: new Date('2024-11-29'),
                source: 'RBI',
            },
        }),
    ]);

    console.log(`✅ Created ${4} exchange rates`);

    // Create Attachments
    console.log('📎 Creating attachments...');
    await Promise.all([
        prisma.attachment.create({
            data: {
                userId: user1.id,
                entityType: 'expense',
                entityId: expenses[0].id,
                fileName: 'receipt_restaurant.jpg',
                fileUrl: 'https://example.com/receipts/receipt_restaurant.jpg',
                fileSize: 245678,
                mimeType: 'image/jpeg',
            },
        }),
        prisma.attachment.create({
            data: {
                userId: user1.id,
                entityType: 'expense',
                entityId: expenses[2].id,
                fileName: 'electricity_bill.pdf',
                fileUrl: 'https://example.com/bills/electricity_bill.pdf',
                fileSize: 156789,
                mimeType: 'application/pdf',
            },
        }),
    ]);

    console.log(`✅ Created ${2} attachments`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: 3`);
    console.log(`   - Categories: ${createdSystemCategories.length + userCategories.length}`);
    console.log(`   - Expenses: ${expenses.length}`);
    console.log(`   - Split Expenses: 2`);
    console.log(`   - Split Participants: 4`);
    console.log(`   - Loans: 2`);
    console.log(`   - Loan Payments: 2`);
    console.log(`   - Budgets: 3`);
    console.log(`   - Monthly Summaries: 2`);
    console.log(`   - Yearly Summaries: 1`);
    console.log(`   - Notifications: 3`);
    console.log(`   - Audit Logs: 2`);
    console.log(`   - Exchange Rates: 4`);
    console.log(`   - Attachments: 2`);
    console.log('\n🔐 Test User Credentials:');
    console.log('   Email: john.doe@example.com');
    console.log('   Password: password123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
