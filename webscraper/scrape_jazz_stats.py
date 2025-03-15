import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime

# URL for the Utah Jazz stats for 2025 season, need to update if this goes through 2026/if I want to go back to 2024
url = "https://www.basketball-reference.com/teams/UTA/2025.html"

response = requests.get(url)

if response.status_code == 200:
    print("Successfully fetched the page!")
else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
    exit()

soup = BeautifulSoup(response.text, 'html.parser')

table = soup.find('table', {'id': 'team_stats'})

headers = [th.get_text() for th in table.find_all('th')]

rows = table.find_all('tr')

stats_data = []

# Loop through the rows and extract the relevant data
for row in rows:
    cols = row.find_all('td')  # Get all the data cells in the row
    player_stats = [col.get_text() for col in cols]

    if player_stats:  # Only include rows with actual player data (skip headers)
        stats_data.append(player_stats)

# Convert the data into a DataFrame
df = pd.DataFrame(stats_data, columns=headers[1:])  # Exclude the 'Rk' column (rank column)

# Add a column for the date the data was scraped
df['date'] = datetime.today().strftime('%Y-%m-%d')

# Save the data to a CSV file (you can store it in a database as well)
df.to_csv('jazz_2025_stats.csv', mode='a', header=False, index=False)

# Display the data for verification
print(df.head())
