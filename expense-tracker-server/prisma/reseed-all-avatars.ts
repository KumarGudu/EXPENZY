import { PrismaClient } from '@prisma/client';
import {
    generateDiceBearUrl,
    generateRandomSeed,
} from '../src/common/utils/avatar-utils';

const prisma = new PrismaClient();

const AVATAR_STYLES = ['adventurer', 'adventurer-neutral', 'thumbs', 'fun-emoji'];

function getRandomStyle() {
    return AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
}

async function reseedAllUserAvatars() {
    console.log('🎨 Reseeding ALL user avatars with new styles...');

    try {
        // Get ALL users
        const users = await prisma.user.findMany();

        console.log(`📊 Found ${users.length} users to update`);

        let updated = 0;
        for (const user of users) {
            // Generate new avatar data with random style
            const avatarSeed = generateRandomSeed();
            const avatarStyle = getRandomStyle();
            const avatarUrl = generateDiceBearUrl(avatarSeed, avatarStyle);

            // Convert hyphen to underscore for database enum
            const dbAvatarStyle = avatarStyle.replace(/-/g, '_');

            await prisma.$executeRawUnsafe(
                `UPDATE users SET avatar_seed = $1, avatar_style = $2::"UserAvatarStyle", avatar_url = $3 WHERE id = $4`,
                avatarSeed,
                dbAvatarStyle,
                avatarUrl,
                user.id,
            );

            updated++;
            console.log(
                `✅ Updated user ${user.email} with style: ${avatarStyle} (${updated}/${users.length})`,
            );
        }

        console.log(`\n🎉 Successfully reseeded ${updated} users with new avatar styles!`);
    } catch (error) {
        console.error('❌ Error reseeding user avatars:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the reseed function
reseedAllUserAvatars()
    .then(() => {
        console.log('✨ Avatar reseeding completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Avatar reseeding failed:', error);
        process.exit(1);
    });
