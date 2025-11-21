import { Participant, Assignment } from '../types';

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Generates a valid Secret Santa assignment where no one picks themselves.
 * Uses a simple shuffle-and-check approach which is efficient for N=6.
 */
export const generateAssignments = (participants: Participant[]): Assignment[] | null => {
  const maxAttempts = 1000;
  let attempts = 0;

  if (participants.length < 2) return null;

  while (attempts < maxAttempts) {
    const receivers = shuffle(participants);
    
    // Check if valid (derangement: no element stays in original position)
    const isValid = participants.every((giver, index) => giver.id !== receivers[index].id);

    if (isValid) {
      return participants.map((giver, index) => ({
        giver,
        receiver: receivers[index],
        revealed: false
      }));
    }

    attempts++;
  }

  console.error("Failed to generate valid assignments after max attempts");
  return null;
};