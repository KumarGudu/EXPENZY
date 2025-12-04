import { PrismaClient } from '@prisma/client';
import { generateRandomSeed } from '../src/common/utils/avatar-utils';

const prisma = new PrismaClient();

async function seedGroupIcons() {
    console.log('🎨 Starting group icon seeding...');

    try {
        // Get all groups without icon data
        const groups = await prisma.group.findMany({
            where: {
                OR: [{ iconSeed: null }, { iconProvider: null }],
            },
        });

        console.log(`📊 Found ${groups.length} groups to update`);

        let updated = 0;
        for (const group of groups) {
            const iconSeed = group.iconSeed || generateRandomSeed();
            const iconProvider = group.iconProvider || 'jdenticon';

            await prisma.group.update({
                where: { id: group.id },
                data: {
                    iconSeed,
                    iconProvider: iconProvider as any,
                },
            });

            updated++;
            console.log(`✅ Updated group ${group.name} (${updated}/${groups.length})`);
        }

        console.log(`\n🎉 Successfully updated ${updated} groups with icon data!`);
    } catch (error) {
        console.error('❌ Error seeding group icons:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seed function
seedGroupIcons()
    .then(() => {
        console.log('✨ Icon seeding completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Icon seeding failed:', error);
        process.exit(1);
    });
