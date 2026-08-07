===================================================================================
                        GENERATIVE UI STUDIO SYSTEM ARCHITECTURE
===================================================================================

+-----------------------------------------------------------------------------------+
|                           LAYER 1: PRESENTATION & SHELL                           |
|                                                                                   |
|  +---------------------+   +---------------------+   +-------------------------+  |
|  |   App Shell & Nav   |   |   Prompt & Chat Bar |   | Interactive Canvas Frame|  |
|  |      (App.tsx)      |   |   (PromptBar.tsx)   |   | (Desktop/Tablet/Mobile) |  |
|  +----------+----------+   +----------+----------+   +------------+------------+  |
+-------------|-------------------------|---------------------------|---------------+
              |                         |                           |
              v                         v                           v
+-----------------------------------------------------------------------------------+
|                        LAYER 2: ROUTER & APPLICATION SUITE                        |
|                                                                                   |
|  +-----------------------------------+   +-------------------------------------+  |
|  |     Standalone Application Suite  |   |      Dynamic Component Factory      |  |
|  |  - FoodRushApp.tsx (Food Delivery)|   |      (DynamicComponent.tsx)         |  |
|  |  - RideXApp.tsx (Urban Mobility)  |   |                                     |  |
|  |  - RemindMeApp.tsx (Smart Alarms) |   |  Component Widgets:                 |  |
|  |  - HotelLuxApp.tsx (Resort App)   |   |  MetricsBar | Chart | Table | Kanban|  |
|  +-----------------------------------+   +------------------+------------------+  |
+-------------------------------------------------------------|---------------------+
                                                              |
                                                              v
+-----------------------------------------------------------------------------------+
|                       LAYER 3: SCHEMA SYNTHESIS & MEDIA ENGINE                    |
|                                                                                   |
|  +-----------------------------------+   +-------------------------------------+  |
|  | Intelligent Schema Synthesizer    |   | Unsplash Photography Resolver       |  |
|  | (schemaSynthesizer.ts)            |   | (imageResolver.ts)                  |  |
|  +-----------------------------------+   +-------------------------------------+  |
+-----------------------------------------------------------------------------------+
|                       LAYER 4: BACKEND & PERSISTENCE TIER                         |
|                                                                                   |
|  +-----------------------------------+   +-------------------------------------+  |
|  | Express.js Server Proxy           |   | Browser LocalStorage Persistence    |  |
|  | (server.ts)                       |   | (gui_studio_project_history)        |  |
|  +-----------------------------------+   +-------------------------------------+  |
+-----------------------------------------------------------------------------------+

===================================================================================
                            COMPONENT RESPONSIBILITIES
===================================================================================

1. App.tsx (Master Router & Orchestrator)
   - Evaluates incoming prompt domain signatures.
   - Routes to Standalone App components (FoodRush, RideX, RemindMe, HotelLux).
   - Manages currentSchema state, history drawer, and viewport device frames.

2. DynamicComponent.tsx (Component Factory Pattern)
   - Instantiates React JSX widgets from DynamicUISchema JSON nodes.
   - Renders Hero Images, Category Chips, Card Listings, Charts, Tables, and Kanbans.

3. schemaSynthesizer.ts (Domain Generator Strategy Pattern)
   - Filters stop-words and evaluates domain keywords.
   - Synthesizes DynamicUISchema JSON layout trees with metrics and themes.

4. imageResolver.ts (Topic Media Resolver)
   - Maps domain categories to high-resolution Unsplash photography URLs.

5. server.ts (Node.js API Proxy)
   - Express server handling proxy requests to Google Gemini 2.5 Flash API.

===================================================================================
                            DESIGN PATTERNS IMPLEMENTED
===================================================================================

- Factory Pattern           --> DynamicComponent.tsx (Schema JSON -> React JSX)
- Strategy Pattern          --> schemaSynthesizer.ts (Domain Keyword Strategies)
- Unidirectional Data Flow  --> App.tsx (State container -> Canvas Viewport)
