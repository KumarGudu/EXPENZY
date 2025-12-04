import { PrismaClient } from '@prisma/client';
import {
    generateDiceBearUrl,
    generateRandomSeed,
} from '../src/common/utils/avatar-utils';

const prisma = new PrismaClient();

async function seedUserAvatars() {
    console.log('🎨 Starting user avatar seeding...');

    try {
        // Get all users without avatar data
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { avatarSeed: null },
                    { avatarStyle: null },
                    { avatarUrl: null },
                ],
            },
        });

        console.log(`📊 Found ${users.length} users to update`);

        let updated = 0;
        for (const user of users) {
            const avatarSeed = user.avatarSeed || generateRandomSeed();
            const avatarStyle = user.avatarStyle || 'rings';
            const avatarUrl = generateDiceBearUrl(avatarSeed, avatarStyle);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    avatarSeed,
                    avatarStyle: avatarStyle as any,
                    avatarUrl,
                },
            });

            updated++;
            console.log(
                `✅ Updated user ${user.email} (${updated}/${users.length})`,
            );
        }

        console.log(`\n🎉 Successfully updated ${updated} users with avatar data!`);
    } catch (error) {
        console.error('❌ Error seeding user avatars:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seed function
seedUserAvatars()
    .then(() => {
        console.log('✨ Avatar seeding completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Avatar seeding failed:', error);
        process.exit(1);
    });
