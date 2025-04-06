import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime

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

# Save the data to a CSV file
df.to_csv('jazz_2025_per_game_stats.csv', mode='w', header=True, index=False)

# Display the data for verification
print(df.head())

