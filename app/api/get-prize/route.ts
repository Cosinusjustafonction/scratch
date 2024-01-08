import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import axios from "axios";

export const dynamic = "force-dynamic";

const prizes = [
  { name: "nothing", weight: 25.0 }, // 25% chance
  { name: "1sol", weight: 0.0 }, // 0% chance
  { name: "0.5sol", weight: 1.0 }, // 1% chance
  { name: "potionticket", weight: 25.0 }, // 25% chance
  { name: "portalnft", weight: 2.0 }, // 2% chance
  { name: "fungi", weight: 25.0 }, // 25% chance
  { name: "freenft", weight: 22.0 }, // 22% chance
];

// Function to pick a random prize based on weights
function pickRandomPrize(prizes: any[]) {
  const totalWeight = prizes.reduce((acc, prize) => acc + prize.weight, 0);
  let random = Math.random() * totalWeight;

  for (const prize of prizes) {
    if (random < prize.weight) {
      return prize.name;
    }
    random -= prize.weight;
  }
}

export async function GET(req: Request) {
  const selectedPrize = pickRandomPrize(prizes);

  const { wallet } = await req.json();

  await prisma.user.upsert({
    where: { wallet },
    update: {},
    create: {
      wallet,
      prize: selectedPrize,
    },
  });

  return NextResponse.json({
    error: false,
    prize: selectedPrize,
  });
}
