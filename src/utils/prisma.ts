import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

async function dbInit() {
	try {
		await prisma.$disconnect();
	} catch (e) {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	}
}

// Faster docker termination
process.on('SIGTERM', () => {
	process.exit();
});
