import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

url = "https://www.basketball-reference.com/teams/UTA/2025.html#per_game_stats"

response = requests.get(url)

if response.status_code == 200:
    print("Successfully fetched the page!")
else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
    exit()

soup = BeautifulSoup(response.text, 'html.parser')

table = soup.find('table', {'id': 'per_game_stats'})

thead = table.find('thead')
headers = [th.get_text() for th in thead.find_all('th')]

print("Headers:", headers)

rows = table.find_all('tr')

stats_data = []

for row in rows:
    cols = row.find_all('td')  
    player_stats = [col.get_text() for col in cols]

    if player_stats:  # skip headers
        stats_data.append(player_stats)

df = pd.DataFrame(stats_data, columns=headers[1:])  # Exclude the 'Rk' column

df['date'] = datetime.today().strftime('%Y-%m-%d')

# Function to handle empty or invalid numeric fields and convert them to None (NULL in DB)
def safe_float(value):
    try:
        return float(value) if value and value != " " else None
    except ValueError:
        return None

# Function to safely convert float to integer
def safe_int(value):
    try:
        return int(float(value)) if value and value != " " else None
    except ValueError:
        return None

#insert into Supabase
for index, row in df.iterrows():
    data = {
        'player_name': row['Player'],
        'age': safe_int(row['Age']),
        'position': row['Pos'],
        'games_played': safe_int(row['G']),
        'games_started': safe_int(row['GS']),
        'minutes_per_game': safe_float(row['MP']),
        'fg_made': safe_float(row['FG']),
        'fg_attempted': safe_float(row['FGA']),
        'fg_percentage': safe_float(row['FG%']),
        'three_p_made': safe_float(row['3P']),
        'three_p_attempted': safe_float(row['3PA']),
        'three_p_percentage': safe_float(row['3P%']),
        'two_p_made': safe_float(row['2P']),
        'two_p_attempted': safe_float(row['2PA']),
        'two_p_percentage': safe_float(row['2P%']),
        'effective_fg_percentage': safe_float(row['eFG%']),
        'free_throws_made': safe_float(row['FT']),
        'free_throws_attempted': safe_float(row['FTA']),
        'free_throws_percentage': safe_float(row['FT%']),
        'offensive_rebounds': safe_float(row['ORB']),
        'defensive_rebounds': safe_float(row['DRB']),
        'total_rebounds': safe_float(row['TRB']),
        'assists': safe_float(row['AST']),
        'steals': safe_float(row['STL']),
        'blocks': safe_float(row['BLK']),
        'turnovers': safe_float(row['TOV']),
        'personal_fouls': safe_float(row['PF']),
        'points': safe_float(row['PTS']),
        'awards': row['Awards'] if pd.notnull(row['Awards']) else '',
        'date': row['date']
    }

    # Insert w/ no syntax error
    response = supabase.table('jazz_stats').insert([data]).execute()

    if response.data:
        print(f"Successfully inserted data for {row['Player']}")
    else:
        print(f"Error inserting data for {row['Player']}: {response.error_message}")
