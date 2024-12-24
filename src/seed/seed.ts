import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

async function seed() {
    const prisma = new PrismaService();

    const existingUser = await prisma.user.findFirst({
        where: { username: 'rohitAchane' },
    });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('123456', 10); // Hash the password
        await prisma.user.create({
            data: {
                username: 'rohitAchane',
                email: 'rohitAchane999@gmail.com',
                password: hashedPassword,
            },
        });

        console.log('Static user created successfully!');
    } else {
        console.log('Static user already exists!');
    }
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
