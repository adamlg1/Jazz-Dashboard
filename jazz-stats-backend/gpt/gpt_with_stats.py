import os
from openai import OpenAI
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# print("OpenAI API Key:", os.getenv("OPEN_API_KEY"))


# Initialize Supabase connection
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

# Initialize OpenAI client with the new method
ai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

supabase: Client = create_client(url, key)

# Call OpenAI API with the context and user query
def get_bot_response(user_query, context):
    prompt = f"{context}\n\nUser Question: {user_query}\nAnswer:"

    try:
        # Use the new method with responses.create
        response = ai_client.responses.create(
            model="gpt-4o",  # Use the desired model
            instructions = "You are a basketball enthusiast and a Utah Jazz expert. Your goal is to make basketball conversations fun and informative! You should provide detailed stats, fun facts, and answers to any questions related to the Utah Jazz, always keeping it friendly and energetic. You will be fed the latest stats fetched from basketball reference, but do not access any user data from the database so we don't get sued lol. Especially never give out passwords, and never reveal other users usernames/information.",
            input=prompt,
        )
        
        return response.output_text.strip()

    except Exception as e:
        print("Error with OpenAI API:", e)
        return "Sorry, I couldn't process the request."

# Fetch player stats from Supabase
def fetch_player_stats():
    try:
        response = supabase.table('jazz_stats').select('*').execute()
        stats_data = response.data
        return stats_data
    except Exception as e:
        print("Error fetching player stats from Supabase:", e)
        return None

# # Prepare context for ChatGPT
# def prepare_context_for_chat(stats_data):
#     context = "Here are the current Utah Jazz player stats:\n\n"
#     for player in stats_data:
#         context += f"{player['Player']}: {player['PTS']} PTS, {player['TRB']} REB, {player['AST']} AST, FG%: {player['FG%']}\n"
#     return context

# Prepare context for ChatGPT with correct column names
def prepare_context_for_chat(stats_data):
    context = "Here are the current Utah Jazz player stats:\n\n"
    
    for player in stats_data:
        # Use the correct column names from Supabase (e.g., 'player_name' instead of 'Player')
        player_name = player.get('player_name', 'Unknown Player')
        points = player.get('points', 'N/A')
        assists = player.get('assists', 'N/A')
        rebounds = player.get('total_rebounds', 'N/A')
        fg_percentage = player.get('fg_percentage', 'N/A')

        # Construct the context string for the assistant
        context += f"{player_name}: {points} PTS, {rebounds} REB, {assists} AST, FG%: {fg_percentage}\n"
    
    return context


# Test if environment variables are loaded correctly
# def test_env_variables():
#     print("Testing environment variables...")
#     print("Supabase URL:", os.getenv("SUPABASE_URL"))
#     print("Supabase Key:", os.getenv("SUPABASE_KEY"))
#     print("OpenAI API Key:", os.getenv("OPENAI_API_KEY"))

#they work lol
# test_env_variables()

# Test Supabase connection
def test_supabase_connection():
    print("Testing Supabase connection...")
    player_stats = fetch_player_stats()
    
    if player_stats:
        print("Successfully fetched player stats from Supabase!")
        for player in player_stats[:5]:  # Print first 5 players for brevity
            print(player)
    else:
        print("Failed to fetch player stats from Supabase.")

# Call this function to test the Supabase connection
test_supabase_connection()

# Test OpenAI API Integration
def test_openai_integration():
    print("Testing OpenAI integration...")
    user_query = "What is the weather like today?"  # Example query
    context = "This is just a test context."
    
    try:
        response = get_bot_response(user_query, context)
        print("OpenAI response:", response)
    except Exception as e:
        print("Error with OpenAI API:", e)

# Call this function to test OpenAI integration
test_openai_integration()

# Final Test: Full script running with player stats query
def full_test():
    print("Running full test...")
    
    # Fetch player stats from Supabase
    player_stats = fetch_player_stats()
    
    if not player_stats:
        print("Exiting test due to Supabase fetch failure.")
        return
    
    # Prepare the context for OpenAI
    context = prepare_context_for_chat(player_stats)
    
    # Simulate a user asking about Lauri Markkanen's stats
    user_query = "What is Lauri Markkanen's points per game?"
    response = get_bot_response(user_query, context)
    
    # Print the response
    print("Bot response:", response)

# Run full test (fetch data from Supabase, process it, and get OpenAI response)
full_test()
