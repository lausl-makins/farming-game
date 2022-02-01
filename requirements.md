> Software Requirements: Minimum Length: 3-5 sentences

- What is the vision of this product?
  - A simple, fun farming simulation game with measurable progress through daily play. 
- What pain point does this project solve?
  - Many people don't have access to farming or gardening, and might enjoy  engaging with those concepts in a fun and relaxing way.
  - Many games require either a subscription, purchase, or account.  Our game is more accessible. 
- Why should we care about your product?
  - In an overstimulating world, people need simple but stimulating entertainment. 
  - Casual games with daily engagement (such as Wordle) have been very popular lately. 
  - Players may extract educational value (we call these "nuggets") from the information presented in the gameplay. 

## Scope (In/Out)
>IN - What will your product do

Describe the individual features that your product will do. High overview of each. Only need to list 4-5

1. Simulate farming via:
    - Allowing seed purchase
    - Sowing seeds
    - Crop growth/tending
    - Harvesting crops
    - Selling crops 
2. Storage of gameplay-related statistics
   - Displayed in table or via Chart.js
3. About page
    - Displays information about developers via photo and biography
4. Educational content implementation
    - Random fun-fact feature (pop-up, etc)
    - Future stretch goals, TBD
5. Ability to unlock more items in store by reaching milestones. 

>OUT - What will your product not do.

<!-- These should be features that you will make very clear from the beginning that you will not do during development. These should be limited and very few. Pick your battles wisely. -->

1. Our site will never be adapted to an iOS, Android, or desktop app.
2. Our site will not feature real-money purchases. 

## Minimum Viable Product 
What will your MVP functionality be?

- Simulated farming experience
  - At least four types of crop
  - Seed sowing
  - Plant watering
  - Plant growth
  - Plant harvesting
- Simple store
- localStorage of game-state and longterm gameplay statistics
- Basic educational content implementation

## Stretch

What stretch goals are you going to aim for?

- Ability to unlock more gameplay features via milestones/achievements
- More types of crops
- More robust educational implementation e.g. quiz game with in-game currency reward, animated pop-up with funfact
- Intercropping (having more crop variety boosts global crop growth)

## Functional Requirements

List the functionality of your product. This will consist of tasks such as the following:

- A user can tend to their farm

- A user can view their statistics

- A user can find varied seeds in the shop with new varieties appearing daily

- A user can learn facts about planting & gardening

## Data Flow

- Page loads
- Crop grid layout is instantiated
- Access local storage to read array of previous plot grid save file & player inventory
- Loop through array to populate grid with plants
- Loop through inventory to populate player's inventory with item 'buttons'
- Each time user modifies state of farm, write gameState to local storage

<!-- Non-Functional Requirements (301 & 401 only)
Non-functional requirements are requirements that are not directly related to the functionality of the application but still important to the app.

Examples include:

Security
Usability
Testability
etc….
Pick 2 non-functional requirements and describe their functionality in your application.

If you are stuck on what non-functional requirements are, do a quick online search and do some research. Write a minimum of 3-5 sentences to describe how the non-functional requirements fits into your app.

You MUST describe what the non-functional requirement is and how it will be implemented. Simply saying “Our project will be testable for testibility” is NOT acceptable. Tell us how, why, and what. -->