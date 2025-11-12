import type { Question } from '../data/questions';
import type { Candidate } from '../data/candidates';

export interface UserAnswers {
  [questionId: number]: {
    answer: number;      // -2 to 2
    importance: number;  // 0 to 2
  };
}

export interface MatchResult {
  candidate: Candidate;
  distance: number;
  similarity: number;
  normalizedScore: number;
  topicScores: { [topic: string]: number };
  agreements: string[];
  disagreements: string[];
}

export interface Point2D {
  x: number;
  y: number;
  label: string;
  type: 'user' | 'candidate';
  data?: Candidate;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
  label: string;
  type: 'user' | 'candidate';
  data?: Candidate;
}

/**
 * Calculate weighted cosine similarity between user and candidate
 */
export function calculateSimilarity(
  userAnswers: UserAnswers,
  candidate: Candidate,
  questions: Question[]
): number {
  let numerator = 0;
  let userMagnitude = 0;
  let candidateMagnitude = 0;

  questions.forEach(q => {
    const ua = userAnswers[q.id];
    if (!ua) return;

    const weight = ua.importance + 1; // Convert 0-2 to 1-3
    const userValue = ua.answer;

    // Map candidate axes to question scale (-10 to 10 → -2 to 2)
    const candidateValue =
      (candidate.axes.economic * q.weights.economic +
       candidate.axes.social * q.weights.social +
       candidate.axes.global * q.weights.global) / 5;

    numerator += weight * userValue * candidateValue;
    userMagnitude += weight * userValue * userValue;
    candidateMagnitude += weight * candidateValue * candidateValue;
  });

  if (userMagnitude === 0 || candidateMagnitude === 0) return 0;

  return numerator / (Math.sqrt(userMagnitude) * Math.sqrt(candidateMagnitude));
}

/**
 * Calculate weighted Euclidean distance between user and candidate
 */
export function calculateDistance(
  userAnswers: UserAnswers,
  candidate: Candidate,
  questions: Question[]
): number {
  let sumSquaredDiff = 0;

  questions.forEach(q => {
    const ua = userAnswers[q.id];
    if (!ua) return;

    const weight = ua.importance + 1; // Convert 0-2 to 1-3
    const userValue = ua.answer;

    // Map candidate axes to question scale
    const candidateValue =
      (candidate.axes.economic * q.weights.economic +
       candidate.axes.social * q.weights.social +
       candidate.axes.global * q.weights.global) / 5;

    const diff = userValue - candidateValue;
    sumSquaredDiff += weight * diff * diff;
  });

  return Math.sqrt(sumSquaredDiff);
}

/**
 * Calculate topic-specific scores
 */
export function calculateTopicScores(
  userAnswers: UserAnswers,
  candidate: Candidate,
  questions: Question[]
): { [topic: string]: number } {
  const topicScores: { [topic: string]: { sum: number; count: number } } = {};

  questions.forEach(q => {
    const ua = userAnswers[q.id];
    if (!ua) return;

    const userValue = ua.answer;
    const candidateTopicValue = candidate.topics[q.topic];

    if (!topicScores[q.topic]) {
      topicScores[q.topic] = { sum: 0, count: 0 };
    }

    // Calculate alignment (-2 to 2 user scale, -10 to 10 candidate scale)
    const alignment = -(Math.abs(userValue * 5 - candidateTopicValue));
    topicScores[q.topic].sum += alignment;
    topicScores[q.topic].count += 1;
  });

  const result: { [topic: string]: number } = {};
  Object.keys(topicScores).forEach(topic => {
    result[topic] = topicScores[topic].sum / topicScores[topic].count;
  });

  return result;
}

/**
 * Find top agreements and disagreements
 */
export function findAgreementsDisagreements(
  userAnswers: UserAnswers,
  candidate: Candidate,
  questions: Question[]
): { agreements: string[]; disagreements: string[] } {
  const diffs = questions
    .filter(q => userAnswers[q.id])
    .map(q => {
      const userValue = userAnswers[q.id].answer;
      const candidateValue =
        (candidate.axes.economic * q.weights.economic +
         candidate.axes.social * q.weights.social +
         candidate.axes.global * q.weights.global) / 5;

      return {
        question: q.text,
        diff: Math.abs(userValue - candidateValue)
      };
    })
    .sort((a, b) => a.diff - b.diff);

  return {
    agreements: diffs.slice(0, 3).map(d => d.question),
    disagreements: diffs.slice(-3).reverse().map(d => d.question)
  };
}

/**
 * Calculate all match results
 */
export function calculateMatches(
  userAnswers: UserAnswers,
  candidates: Candidate[],
  questions: Question[]
): MatchResult[] {
  const results = candidates.map(candidate => {
    const distance = calculateDistance(userAnswers, candidate, questions);
    const similarity = calculateSimilarity(userAnswers, candidate, questions);
    const topicScores = calculateTopicScores(userAnswers, candidate, questions);
    const { agreements, disagreements } = findAgreementsDisagreements(
      userAnswers,
      candidate,
      questions
    );

    return {
      candidate,
      distance,
      similarity,
      normalizedScore: 0, // Will be set after normalization
      topicScores,
      agreements,
      disagreements
    };
  });

  // Normalize scores to 0-9.5 scale based on distance (never perfect 10)
  const distances = results.map(r => r.distance);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);
  const range = maxDist - minDist || 1;

  results.forEach(r => {
    // Closer distance = higher score, max 9.5
    const normalized = 9.5 - ((r.distance - minDist) / range) * 9.5;
    r.normalizedScore = Math.round(normalized * 10) / 10;
  });

  return results.sort((a, b) => b.normalizedScore - a.normalizedScore);
}

/**
 * Project user and candidates into 2D space using raw economic/social axes
 */
export function projectTo2D(
  userAnswers: UserAnswers,
  candidates: Candidate[],
  questions: Question[]
): Point2D[] {
  // Calculate user's position in axis space
  let userEconomic = 0;
  let userSocial = 0;
  let userGlobal = 0;
  let totalWeight = 0;

  questions.forEach(q => {
    const ua = userAnswers[q.id];
    if (!ua) return;

    const weight = (ua.importance + 1) * Math.abs(ua.answer);
    userEconomic += ua.answer * q.weights.economic * weight;
    userSocial += ua.answer * q.weights.social * weight;
    userGlobal += ua.answer * q.weights.global * weight;
    totalWeight += weight;
  });

  if (totalWeight > 0) {
    userEconomic = (userEconomic / totalWeight) * 10;
    userSocial = (userSocial / totalWeight) * 10;
    userGlobal = (userGlobal / totalWeight) * 10;
  }

  // Create all points using raw axes (no MDS) to preserve orientation
  const result: Point2D[] = [
    {
      x: userEconomic,
      y: userSocial,
      label: 'You',
      type: 'user'
    }
  ];

  // Add all candidates using their raw economic/social axes
  candidates.forEach(c => {
    result.push({
      x: c.axes.economic,
      y: c.axes.social,
      label: c.name,
      type: 'candidate',
      data: c
    });
  });

  return result;
}

/**
 * Project user and candidates into 3D space using actual axes
 */
export function projectTo3D(
  userAnswers: UserAnswers,
  candidates: Candidate[],
  questions: Question[]
): Point3D[] {
  // Calculate user's position in all three axes
  let userEconomic = 0;
  let userSocial = 0;
  let userGlobal = 0;
  let totalWeight = 0;

  questions.forEach(q => {
    const ua = userAnswers[q.id];
    if (!ua) return;

    const weight = (ua.importance + 1) * Math.abs(ua.answer);
    userEconomic += ua.answer * q.weights.economic * weight;
    userSocial += ua.answer * q.weights.social * weight;
    userGlobal += ua.answer * q.weights.global * weight;
    totalWeight += weight;
  });

  if (totalWeight > 0) {
    userEconomic = (userEconomic / totalWeight) * 10;
    userSocial = (userSocial / totalWeight) * 10;
    userGlobal = (userGlobal / totalWeight) * 10;
  }

  // Create result array
  const result: Point3D[] = [
    {
      x: userEconomic,
      y: userSocial,
      z: userGlobal,
      label: 'You',
      type: 'user'
    }
  ];

  // Add all candidates
  candidates.forEach(c => {
    result.push({
      x: c.axes.economic,
      y: c.axes.social,
      z: c.axes.global,
      label: c.name,
      type: 'candidate',
      data: c
    });
  });

  return result;
}
