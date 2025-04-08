# Jazz-Dashboard
Final Project for Database Modeling Concepts

Sketch of initial thinking on my ERD and the data your project will be accessing and using (will replace this with an electronically made ERD diagram over the course of the project)
![IMG_0256](https://github.com/user-attachments/assets/e5ad3afb-2b8a-4755-baa4-801d39a6304f)

Sketch rough system design of your project, what are the technologies and pieces (shapes) and interactions (arrows) (this will also ideally be replaced over the course of the project)
![IMG_0255](https://github.com/user-attachments/assets/adfef1a4-269f-466b-8f9d-81f74c836f09)
I will be using python beautiful soup instead of my initial ideas. It seems to be the best way, and I will most likely scrape Basketball reference.

## Goals for where I want my project to be at the following dates:
* 3/19 - Ugly website up, script scraping ESPN/Basketball Reference sort of working (at least grabs some data, not everything)
* 3/26 - Script to scrape for recent data works, and runs at a consistent time each day. User can view previous days of data as well.
* 4/2 - Prettying website, potentially have script pull the latest article on the Utah Jazz as well.
* 4/9 - Implement logging in, and store passwords securely through bcrypt and AWS dynamodb. 
* 4/16 - (hopefully have tested all along the way) Check all tests have a positive and negative case, load test, and fix security vulnerabilities.

Please include any additional relevant information you'd like to include or have. The website will be fairly simple as far as UX, but it will have the player's faces by the leading scorer and other stats for that day/week. I would like to store the stats historically, and hopefully be able to filter them by week. This will likely take going backwards and adding some data to test the website.

3/19 
* The script is grabbing data, and converting it into a csv file. I have not yet made the script run on a consistent time scale, nor have I set up my database configuration yet. The basics for connecting the backend and frontend are working. This should be leading me to being able to develop the frontend aspects, and then start making my queries based off of user input.
![image](https://github.com/user-attachments/assets/5e6518e1-7bc1-49e4-8e58-f7cc8d62594a)

4/7
Update - This website's focus has changed slightly from what it was before. Instead of storing everything on AWS, I have decided to use supabase so that I could gain experience using that. Currently, the script is able to scrape basketball reference, insert everything into supabase, and then the frontend is able to display those stats. The latest stats are fed to gpt, and I have a chatbot working right now. I might try to make it so the user can upload a background image for the chat in a settings tab. The next step is potentially storing the user chats, and implementing the login screen so that when unauthenticated, the user can only access the login and about pages. I'm hoping to come up with some other cool features before next Monday when I present as well. However, I have been able to make good progress on the website and believe it will seem pretty cool. At least 5th grade me would be proud.
