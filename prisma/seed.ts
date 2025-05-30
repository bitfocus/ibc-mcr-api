import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding database...");
	/*
  // Create a sample event
  const event = await prisma.event.create({
    data: {
      title: 'Sample Event',
      sources: {
        create: [
          {
            label: 'Camera 1',
            ports: {
              create: [
                {
                  type: 'video',
                  channel: 1,
                  description: 'Main video feed'
                },
                {
                  type: 'audio',
                  channel: 1,
                  description: 'Main audio feed'
                }
              ]
            }
          },
          {
            label: 'Camera 2',
            ports: {
              create: [
                {
                  type: 'video',
                  channel: 2,
                  description: 'Secondary video feed'
                },
                {
                  type: 'audio',
                  channel: 2,
                  description: 'Secondary audio feed'
                }
              ]
            }
          }
        ]
      },
      destinations: {
        create: [
          {
            label: 'Output 1',
            ports: {
              create: [
                {
                  type: 'video',
                  channel: 1,
                  description: 'Main output video'
                },
                {
                  type: 'audio',
                  channel: 1,
                  description: 'Main output audio'
                }
              ]
            }
          },
          {
            label: 'Output 2',
            ports: {
              create: [
                {
                  type: 'video',
                  channel: 2,
                  description: 'Secondary output video'
                },
                {
                  type: 'audio',
                  channel: 2,
                  description: 'Secondary output audio'
                }
              ]
            }
          }
        ]
      },
      partylines: {
        create: [
          {
            title: 'Production Team'
          },
          {
            title: 'Camera Operators'
          }
        ]
      }
    },
    include: {
      sources: {
        include: {
          ports: true
        }
      },
      destinations: {
        include: {
          ports: true
        }
      }
    }
  });

  // Create flow edges (connections between source and destination ports)
  // Connect Camera 1 video to Output 1 video
  await prisma.flowEdge.create({
    data: {
      sourcePortId: event.sources[0].ports[0].id, // Camera 1 video port
      destinationPortId: event.destinations[0].ports[0].id // Output 1 video port
    }
  });

  // Connect Camera 1 audio to Output 1 audio
  await prisma.flowEdge.create({
    data: {
      sourcePortId: event.sources[0].ports[1].id, // Camera 1 audio port
      destinationPortId: event.destinations[0].ports[1].id // Output 1 audio port
    }
  });

  // Connect Camera 2 video to Output 2 video
  await prisma.flowEdge.create({
    data: {
      sourcePortId: event.sources[1].ports[0].id, // Camera 2 video port
      destinationPortId: event.destinations[1].ports[0].id // Output 2 video port
    }
  });

  // Connect Camera 2 audio to Output 2 audio
  await prisma.flowEdge.create({
    data: {
      sourcePortId: event.sources[1].ports[1].id, // Camera 2 audio port
      destinationPortId: event.destinations[1].ports[1].id // Output 2 audio port
    }
  });
*/
	console.log("Database seeded successfully!");
}

main()
	.catch((e) => {
		console.error("Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
