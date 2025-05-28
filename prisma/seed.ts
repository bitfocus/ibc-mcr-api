import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clean up existing data
  await prisma.flowEdge.deleteMany();
  await prisma.sourcePort.deleteMany();
  await prisma.destinationPort.deleteMany();
  await prisma.partyline.deleteMany();
  await prisma.source.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.event.deleteMany();

  console.log('Deleted existing data');

  // Create events
  const event1 = await prisma.event.create({
    data: {
      title: 'Eurovision 2025',
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'World Cup Final 2026',
    },
  });

  console.log(`Created events: ${event1.id}, ${event2.id}`);

  // Create sources for event1
  const source1 = await prisma.source.create({
    data: {
      label: 'Main Camera',
      eventId: event1.id,
    },
  });

  const source2 = await prisma.source.create({
    data: {
      label: 'Stage Left Camera',
      eventId: event1.id,
    },
  });

  const source3 = await prisma.source.create({
    data: {
      label: 'Stage Right Camera',
      eventId: event1.id,
    },
  });

  console.log(`Created sources for event1: ${source1.id}, ${source2.id}, ${source3.id}`);

  // Create sources for event2
  const source4 = await prisma.source.create({
    data: {
      label: 'Field Camera 1',
      eventId: event2.id,
    },
  });

  const source5 = await prisma.source.create({
    data: {
      label: 'Field Camera 2',
      eventId: event2.id,
    },
  });

  console.log(`Created sources for event2: ${source4.id}, ${source5.id}`);

  // Create destinations for event1
  const destination1 = await prisma.destination.create({
    data: {
      label: 'Main Output',
      eventId: event1.id,
    },
  });

  const destination2 = await prisma.destination.create({
    data: {
      label: 'Backup Output',
      eventId: event1.id,
    },
  });

  console.log(`Created destinations for event1: ${destination1.id}, ${destination2.id}`);

  // Create destinations for event2
  const destination3 = await prisma.destination.create({
    data: {
      label: 'Broadcast Output',
      eventId: event2.id,
    },
  });

  const destination4 = await prisma.destination.create({
    data: {
      label: 'Stadium Screens',
      eventId: event2.id,
    },
  });

  console.log(`Created destinations for event2: ${destination3.id}, ${destination4.id}`);

  // Create partylines for event1
  const partyline1 = await prisma.partyline.create({
    data: {
      title: 'Director Channel',
      eventId: event1.id,
    },
  });

  const partyline2 = await prisma.partyline.create({
    data: {
      title: 'Camera Operators',
      eventId: event1.id,
    },
  });

  console.log(`Created partylines for event1: ${partyline1.id}, ${partyline2.id}`);

  // Create partylines for event2
  const partyline3 = await prisma.partyline.create({
    data: {
      title: 'Production Team',
      eventId: event2.id,
    },
  });

  const partyline4 = await prisma.partyline.create({
    data: {
      title: 'Field Reporters',
      eventId: event2.id,
    },
  });

  console.log(`Created partylines for event2: ${partyline3.id}, ${partyline4.id}`);

  // Create source ports for event1 sources
  const sourcePort1 = await prisma.sourcePort.create({
    data: {
      type: 'video',
      channel: 1,
      description: 'Main video feed',
      sourceId: source1.id,
    },
  });

  const sourcePort2 = await prisma.sourcePort.create({
    data: {
      type: 'audio',
      channel: 1,
      description: 'Main audio feed',
      sourceId: source1.id,
    },
  });

  const sourcePort3 = await prisma.sourcePort.create({
    data: {
      type: 'video',
      channel: 1,
      description: 'Stage left video feed',
      sourceId: source2.id,
    },
  });

  console.log(`Created source ports: ${sourcePort1.id}, ${sourcePort2.id}, ${sourcePort3.id}`);

  // Create destination ports for event1 destinations
  const destinationPort1 = await prisma.destinationPort.create({
    data: {
      type: 'video',
      channel: 1,
      description: 'Main video output',
      destinationId: destination1.id,
    },
  });

  const destinationPort2 = await prisma.destinationPort.create({
    data: {
      type: 'audio',
      channel: 1,
      description: 'Main audio output',
      destinationId: destination1.id,
    },
  });

  const destinationPort3 = await prisma.destinationPort.create({
    data: {
      type: 'video',
      channel: 1,
      description: 'Backup video output',
      destinationId: destination2.id,
    },
  });

  console.log(`Created destination ports: ${destinationPort1.id}, ${destinationPort2.id}, ${destinationPort3.id}`);

  // Create flow edges (connections between source and destination ports)
  const flowEdge1 = await prisma.flowEdge.create({
    data: {
      sourcePortId: sourcePort1.id,
      destinationPortId: destinationPort1.id,
    },
  });

  const flowEdge2 = await prisma.flowEdge.create({
    data: {
      sourcePortId: sourcePort2.id,
      destinationPortId: destinationPort2.id,
    },
  });

  console.log(`Created flow edges: ${flowEdge1.id}, ${flowEdge2.id}`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
