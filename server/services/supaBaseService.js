/**
 * @file server/services/supaBaseService.js
 * @description
 * This service layer handles interactions with the Supabase database.
 * It exports functions for user management (create, retrieve, update credits, etc.)
 * and will be extended for sharing flowcharts if needed.
 *
 * @notes
 * - All environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) should be in `.env`.
 * - We use a "service role" key, so treat it securely; do not expose it to clients.
 */

const { createClient } = require('@supabase/supabase-js');

/**
 * Supabase client initialization
 * - We retrieve the URL and service role key from environment variables
 * - This key must remain on the server side only
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches a user record by userId (UUID).
 * @function getUserById
 * @param {string} userId - The unique user identifier
 * @returns {Promise<Object>} The user record from the 'users' table
 * @throws Will throw an error if Supabase fails or if no user is found
 */
async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Creates a new user record with default free_credit_used=false and credits=0.
 * @function createUser
 * @param {string} userId - The unique user identifier (UUID)
 * @returns {Promise<Object>} The newly created user record
 * @throws Will throw an error if Supabase insertion fails
 */
async function createUser(userId) {
  const { data, error } = await supabase
    .from('users')
    .insert({ user_id: userId })
    .single();

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Marks the user's free credit as used.
 * @function setFreeCreditUsed
 * @param {string} userId - The unique user identifier
 * @returns {Promise<Object>} The updated user record
 * @throws Will throw an error if Supabase update fails
 */
async function setFreeCreditUsed(userId) {
  const { data, error } = await supabase
    .from('users')
    .update({
      free_credit_used: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Increments the user's credits by a given amount.
 * Typically called upon successful payment or admin grant.
 * @function incrementCredit
 * @param {string} userId - The unique user identifier
 * @param {number} amount - How many credits to add
 * @returns {Promise<Object>} The updated user record
 * @throws Will throw an error if user not found or update fails
 */
async function incrementCredit(userId, amount) {
  // Retrieve the existing user to ensure it exists
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Calculate new credit count
  const newCreditTotal = (user.credits || 0) + amount;

  // Update the user's credits
  const { data, error: updateError } = await supabase
    .from('users')
    .update({
      credits: newCreditTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .single();

  if (updateError) {
    throw updateError;
  }
  return data;
}

/**
 * Decrements the user's credits by 1, ensuring they have enough credits first.
 * @function decrementCredit
 * @param {string} userId - The unique user identifier
 * @returns {Promise<Object>} The updated user record
 * @throws Will throw an error if user not found or insufficient credits
 */
async function decrementCredit(userId) {
  // Retrieve the existing user
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!user || user.credits < 1) {
    // The user does not have enough credits to decrement
    throw new Error('Insufficient credits');
  }

  const newCreditTotal = user.credits - 1;

  // Update the user's credits
  const { data, error: updateError } = await supabase
    .from('users')
    .update({
      credits: newCreditTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .single();

  if (updateError) {
    throw updateError;
  }
  return data;
}

module.exports = {
  supabase,
  getUserById,
  createUser,
  setFreeCreditUsed,
  incrementCredit,
  decrementCredit,
};
