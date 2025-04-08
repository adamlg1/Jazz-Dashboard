import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
url = os.getenv("SUPABASE_URL")  
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# URL for the Utah Jazz stats for the 2025 season
url = "https://www.basketball-reference.com/teams/UTA/2025.html#per_game_stats"

response = requests.get(url)

if response.status_code == 200:
    print("Successfully fetched the page!")
else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
    exit()

soup = BeautifulSoup(response.text, 'html.parser')

# Find the correct table with id 'per_game_stats'
table = soup.find('table', {'id': 'per_game_stats'})

# Look for the 'thead' section for headers
thead = table.find('thead')
headers = [th.get_text() for th in thead.find_all('th')]

# Print headers to inspect them
print("Headers:", headers)

# Now find the table rows and process the data
rows = table.find_all('tr')

stats_data = []

# Loop through the rows and extract the relevant data
for row in rows:
    cols = row.find_all('td')  # Get all the data cells in the row
    player_stats = [col.get_text() for col in cols]

    if player_stats:  # Only include rows with actual player data (skip headers)
        stats_data.append(player_stats)

# Convert the data into a DataFrame, excluding the 'Rk' column (rank column)
df = pd.DataFrame(stats_data, columns=headers[1:])  # Exclude the 'Rk' column

# Add a column for the date the data was scraped
df['date'] = datetime.today().strftime('%Y-%m-%d')

# Loop through the DataFrame rows and insert each row into Supabase
for index, row in df.iterrows():
    data = {
        'player_name': row['Player'],  # Ensure the column names match your table's columns
        'age': row['Age'],
        'position': row['Pos'],
        'games_played': row['G'],
        'games_started': row['GS'],
        'minutes_per_game': row['MP'],
        'fg_made': row['FG'],
        'fg_attempted': row['FGA'],
        'fg_percentage': row['FG%'],
        'three_p_made': row['3P'],
        'three_p_attempted': row['3PA'],
        'three_p_percentage': row['3P%'],
        'two_p_made': row['2P'],
        'two_p_attempted': row['2PA'],
        'two_p_percentage': row['2P%'],
        'effective_fg_percentage': row['eFG%'],
        'free_throws_made': row['FT'],
        'free_throws_attempted': row['FTA'],
        'free_throws_percentage': row['FT%'],
        'offensive_rebounds': row['ORB'],
        'defensive_rebounds': row['DRB'],
        'total_rebounds': row['TRB'],
        'assists': row['AST'],
        'steals': row['STL'],
        'blocks': row['BLK'],
        'turnovers': row['TOV'],
        'personal_fouls': row['PF'],
        'points': row['PTS'],
        'awards': row['Awards'] if pd.notnull(row['Awards']) else '',  # Handle missing data
        'date': row['date']
    }

    # Insert the row into the Supabase table using the correct syntax
    response = supabase.table('jazz_stats').insert([data]).execute()

    # Check if insertion was successful
    if response.data:
        print(f"Successfully inserted data for {row['Player']}")
    else:
        print(f"Error inserting data for {row['Player']}: {response.error_message}")
