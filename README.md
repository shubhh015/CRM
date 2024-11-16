# CRM Application

This is a Customer Relationship Management (CRM) web application built with React and Material UI. It includes functionalities for managing segments, campaigns, and dashboard views. The app integrates with Google OAuth for authentication and displays key performance metrics through various visualizations like pie charts.

## Features

-   **Authentication**: Google OAuth login and logout functionality.
-   **Dashboard**: Overview of key metrics and data.
-   **Segments**: Create, edit, and delete customer segments with complex conditions.
-   **Campaigns**: Manage campaigns tied to customer segments.
-   **Data Visualization**: Pie charts and other visualizations for data insights.

## Pages

### 1. Login Page

The login page is the entry point to the application. Users authenticate using Google OAuth to gain access to the CRM dashboard and other features. Upon successful login, the app stores an authentication token in localStorage.

### 2. Dashboard Page

The dashboard provides a high-level overview of key metrics such as the number of open and closed campaigns. It includes visualizations like pie charts and tables to display data in an accessible format.

### 3. Segments Page

In this section, users can view and manage their customer segments. Users can create, edit, or delete segments, each defined by a set of conditions. Segments can be grouped with "AND"/"OR" logic to filter customers based on different criteria.

-   **Create Segment**: Users can add a new segment by defining its name and conditions.
-   **Edit Segment**: Existing segments can be updated with new names or conditions.
-   **Delete Segment**: Segments can be deleted permanently after confirmation.

### 4. Campaigns Page

Users can manage their campaigns here. The campaigns are linked to segments, and this page provides functionalities to view, create, edit, or delete campaigns. Campaigns can be tracked based on various parameters.

## Components

### 1. Navbar

The Navbar component serves as the top navigation bar for the application. It includes links to the dashboard, segments, and campaigns, along with a logout button. The navbar is conditionally displayed based on whether the user is authenticated.

### 2. OpenClosedGraph

The OpenClosedGraph component renders a pie chart to visualize the open and closed statuses of various items, such as campaigns. It takes `openCount` and `closedCount` as props and displays them with customizable colors.

### 3. SegmentManager

The SegmentManager component handles the creation, editing, and deletion of segments. It allows users to define segments by specifying conditions and logic, and it manages the state for editing and deleting segments.

### 4. Modals and Alerts

The app uses modal dialogs for confirming actions like deleting a segment or saving a new segment. Alerts are displayed for invalid actions, such as missing a segment name.

## API Endpoints

The app interacts with the backend through the following API endpoints. These endpoints handle the core functionalities like managing segments, campaigns, and user authentication.

### 1. Authentication API

-   **POST `/auth/login`**:

    -   Functionality: Handles Google OAuth authentication.
    -   Request Body: `idToken` (The token received after Google login)
    -   Response: Auth token if authentication is successful.

-   **POST `/auth/logout`**:
    -   Functionality: Logs the user out and invalidates their session.
    -   Request Body: None
    -   Response: Success message or error.

### 2. Segments API

-   **GET `/segments`**:

    -   Functionality: Fetches all the segments available for the authenticated user.
    -   Request Body: None
    -   Response: List of segments with their details (name, conditions, audience size, created at, etc.).

-   **POST `/segments`**:

    -   Functionality: Creates a new segment.
    -   Request Body:
        ```json
        {
            "name": "Segment Name",
            "conditions": [
                {
                    "logic": "AND",
                    "conditions": [
                        {
                            "field": "totalSpending",
                            "operator": ">",
                            "value": "100"
                        }
                    ]
                }
            ]
        }
        ```
    -   Response: Created segment details.

-   **PUT `/segments/{id}`**:

    -   Functionality: Updates an existing segment by its ID.
    -   Request Body:
        ```json
        {
            "name": "Updated Segment Name",
            "conditions": [
                {
                    "logic": "OR",
                    "conditions": [
                        {
                            "field": "visits",
                            "operator": ">=",
                            "value": "5"
                        }
                    ]
                }
            ]
        }
        ```
    -   Response: Updated segment details.

-   **DELETE `/segments/{id}`**:
    -   Functionality: Deletes an existing segment by its ID.
    -   Request Body: None
    -   Response: Success message indicating the segment has been deleted.

### 3. Campaigns API

-   **GET `/campaigns`**:

    -   Functionality: Fetches all campaigns linked to the authenticated user.
    -   Request Body: None
    -   Response: List of campaigns with their details (name, status, linked segments, etc.).

-   **POST `/campaigns`**:

    -   Functionality: Creates a new campaign linked to specific segments.
    -   Request Body:
        ```json
        {
            "name": "Campaign Name",
            "segmentIds": ["segment1Id", "segment2Id"],
            "status": "active"
        }
        ```
    -   Response: Created campaign details.

-   **PUT `/campaigns/{id}`**:

    -   Functionality: Updates an existing campaign by its ID.
    -   Request Body:
        ```json
        {
            "name": "Updated Campaign Name",
            "status": "closed"
        }
        ```
    -   Response: Updated campaign details.

-   **DELETE `/campaigns/{id}`**:
    -   Functionality: Deletes a campaign by its ID.
    -   Request Body: None
    -   Response: Success message indicating the campaign has been deleted.

### 4. Data and Visualization API

-   **GET `/metrics/campaign-status`**:
    -   Functionality: Retrieves the current open and closed campaign statistics for visualization.
    -   Request Body: None
    -   Response:
        ```json
        {
            "openCount": 25,
            "closedCount": 15
        }
        ```

## Technologies Used

-   **React**: JavaScript library for building user interfaces.
-   **Material UI**: A popular React UI framework used for styling components.
-   **Recharts**: A charting library for rendering data visualizations like pie charts.
-   **React Router**: Used for routing and navigation between pages.
-   **Google OAuth**: For handling user authentication.
-   **Node.js/Express**: Backend server for handling API requests.
-   **MongoDB**: Database for storing user and campaign/segment data.

## Setup and Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/crm-app.git
    ```

2. **Install dependencies**:
   Navigate to the project directory and install the required packages:

    ```bash
    cd crm-app
    npm install
    ```

3. **Run the app locally**:
   Start the development server to run the app on your local machine:

    ```bash
    npm start
    ```

4. **Build the app for production**:
   To build the app for production, use:

    ```bash
    npm run build
    ```

5. **Backend Setup**:
   Make sure to set up the backend (Node.js/Express server) separately, as it handles the API requests and authentication.
